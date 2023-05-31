import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';

import { ExampleService } from './home/ServerService/example.service.browser';

const serverState = JSON.parse(document?.querySelector('#ng-universal-state')?.textContent as string);

// TODO: auto generate this
function createProxy(service: string) {
  // Proxy with fetch api
  return new Proxy({}, {
    get: (target, method: string) => {
      return async (...args: any[]) => {
        // deterministic stringify
        const arg = JSON.stringify(args);
        if (serverState[service] && serverState[service][method] && serverState[service][method][arg]) {
          const state = serverState[service][method][arg];
          console.info(`Using server state for ${service}.${method}`, JSON.stringify(state, null, 2));
          delete serverState[service][method];
          return state;
        } else {
          console.info(`Requesting server state for ${service}.${method}`);
        }
        const ngServerService = `angular-server-services`
        // TODO: support GET and use query params
        const response = await fetch(`/${ngServerService}/${service}/${method}`, {
          method: 'POST',
          body: arg,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.json();
      }
    }
  });
}


export const browserConfig: ApplicationConfig = {
  providers: [
    // TODO: auto generate this
    { provide: ExampleService, useFactory: () => createProxy('ExampleService')}
  ]
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
