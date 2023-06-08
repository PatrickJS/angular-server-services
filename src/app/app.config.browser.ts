import { mergeApplicationConfig, ApplicationConfig, TransferState, makeStateKey } from '@angular/core';
import { appConfig } from './app.config';

import { ExampleService } from "@client/ExampleService";
import { HttpClient } from '@angular/common/http';

// TODO: auto generate this
function createProxy(service: string, httpClient: HttpClient, transferState: TransferState) {
  // Proxy with httpClient api
  // batch requests with rxjs
  return new Proxy({}, {
    get: (target, method: string) => {
      return async (...args: any[]) => {
        // does httpClient deterministically stringify args??
        const params = JSON.stringify(args);
        const key = makeStateKey(`${service}.${method}(${params})`)
        if (transferState.hasKey(key)) {
          const res = transferState.get(key, null);
          if (res) {
            transferState.remove(key);
            return res;
          }
        }
        const ngServerService = `angular-server-services`;
        // TODO: support GET and use query params maybe
        const response = await httpClient.post(`/${ngServerService}/${service}/${method}`, args).toPromise();
        return response;
      };
    }
  });
}
export const browserConfig: ApplicationConfig = {
  providers: [
  // TODO: auto generate this
  {
    provide: ExampleService,
    useFactory: (httpClient: HttpClient, transferState: TransferState) => createProxy('ExampleService', httpClient, transferState),
    deps: [HttpClient, TransferState]
  }]
};
export const config = mergeApplicationConfig(appConfig, browserConfig);