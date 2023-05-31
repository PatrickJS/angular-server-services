import 'reflect-metadata'; // injection-js
import 'cross-fetch/polyfill';
import 'zone.js/node';
import 'zone.js/dist/zone-patch-fetch';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap, {injector, transferState} from '../src/bootstrap.server';

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

  // TODO: auto generate this in ngExpressEngine to get injector
  server.post('/angular-server-services/:Service/:Method', (req, res) => {
    const service = injector.get(req.params.Service);
    console.log('angular-server-service request: service', req.params.Service)
    const method = service[req.params.Method];
    console.log('angular-server-service request: method', req.params.Method)
    console.log('angular-server-service request: body', req.body)
    method.apply(service, req.body).then((result: any) => {
      res.json(result);
    });
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '0'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    // TODO: better transfer state
    const state = {};
    transferState._state = state;
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
      ],
    }, (err, html) =>{
      if (err) {
        console.error(err);
        res.send(err);
      }
      console.log('SSR done');
      // TODO: better transfer state
      // TODO: auto generate this
      res.send(html.replace(/<!-- NG-UNIVERSAL -->/, `<script id="ng-universal-state" type="angular/json">${JSON.stringify(state, null, 2)}</script>`));
    });
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