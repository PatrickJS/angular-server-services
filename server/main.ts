import 'reflect-metadata'; // injection-js
import 'cross-fetch/polyfill';
import 'zone.js/node';
import 'zone.js/dist/zone-patch-fetch';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { existsSync, promises } from 'node:fs';
import { join } from 'node:path';
import bootstrap from '../src/bootstrap.server';
import * as ServerServices from "@server";

import {serverService} from './ngServerServices';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular-server-services/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap
  }));
  
  server.set('view engine', 'html');
  server.set('views', distFolder);
  
  server.use(bodyParser.json());

  
  // Example Express Rest API endpoints
  server.get('/api/**', (req, res) => {
  });

 
  server.post('/angular-server-services', async (req, res) => {
    const request = req.body;
    console.log('angular-server-services request:', request)

    // setup ngApp for server
    const document = await promises.readFile(join(distFolder, indexHtml + '.html'), 'utf-8');
    // angular needs to render a url
    const url = `${req.protocol}://${req.get('host') || ''}${req.baseUrl}/`;
    const providers = [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    const config = {document, req, res, url, bootstrap, providers};

    async function invokeService(appRef: any, Service: any, Method: string, args: any) {
      const injector = appRef.injector;
      const serviceToken = (ServerServices as any)[Service];
      const serviceInstance = injector.get(serviceToken) as any;
      const method = serviceInstance[Method];
      const json = await method.apply(serviceInstance, args);
      console.log(`angular-server-service invoke: ${Service}.${Method}( ${JSON.stringify(args)} );`, json)
      return json;
    }

    const services = await serverService(config);
    const invokeServices = request.map(async (info: any) => {
      const result = await services.invoke(
        invokeService,
        info.service,
        info.method,
        info.args
      );
      return result;
    })
    const allRes = await Promise.allSettled(invokeServices);
    await services.destroy();
    const resJson = allRes.map((res: any, index) => {
      return {
        ...request[index],
        ...res
      }
    });


    res.json(resJson);
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '0'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
      ],
    }, (err, html) => {
      if (err) {
        console.error(err);
        res.send(err);
      }
      console.log('rendering html');
      res.send(html);
    })
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from '../src/bootstrap.server';

// fixes prerendering
export default bootstrap;