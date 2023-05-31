import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';

import { ExampleService } from './home/ServerService/example.service.browser';

function createProxy(service: string) {
  // Proxy with fetch api
  return new Proxy({}, {
    get: (target, method: string) => {
      return async (...args: any[]) => {
        const ngServerService = `angular-server-services`
        // TODO: support GET and use query params
        const response = await fetch(`/${ngServerService}/${service}/${method}`, {
          method: 'POST',
          body: JSON.stringify(args),
        });
        return response.json();
      }
    }
  });
}


export const browserConfig: ApplicationConfig = {
  providers: [
    { provide: ExampleService, useFactory: () => createProxy('ExampleService')}
  ]
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
