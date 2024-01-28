import { mergeApplicationConfig, ApplicationConfig, TransferState, makeStateKey, APP_INITIALIZER, Injectable, inject } from '@angular/core';
import { appConfig } from './app.config';

import { ExampleService } from "@client/ExampleService";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from "rxjs";

// TODO: auto generate this

@Injectable({
  providedIn: 'root'
})
export class BatchClientRequests {
  httpClient = inject(HttpClient);
  transferState = inject(TransferState);
  _queue: any[] = [];
  _promises = new Map();
  _timer: any = null;
  _processing = false;
  _delay = 50;

  init(delay: number = this._delay) {
    this._delay = delay;
    this.queue();
  }
  queue() {
    if (this._processing)  return;
    this._processing = true;
    this._timer = setTimeout(() => {
      this.flush();
    }, this._delay);
  }
  async flush() {
    const body = this._queue;
    if (this._queue.length === 0) {
      this._processing = false;
      clearTimeout(this._timer);
      return;
    }
    this._queue = [];
    clearTimeout(this._timer);
    const ngServerService = `angular-server-services`;
    // TODO: support GET and use query params maybe
    const response = await lastValueFrom(
      this.httpClient.post(`/${ngServerService}`, body)
    ) as typeof body;
    let data = null;

    // TODO: use rxjs to ensure backpressure
    body.forEach((res: any, index) => {
      this._promises.get(res).resolve(response[index].value);
    });
    this._processing = false;
    if (this._queue.length) {
      this.queue();
    }
    return data;
  }
  _createDefer() {
    let resolve: any;
    let reject: any;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  pushQueue(data: any) {
    this._queue.push(data);
    // create defer promise
    const defer = this._createDefer();
    this._promises.set(data, defer);
    this.queue();
    return defer.promise;
  }
  createProxy(service: string) {
    // Proxy with httpClient api
    // batch requests with rxjs
    return new Proxy({}, {
      get: (target, method: string) => {
        return async (...args: any[]) => {
          // does httpClient deterministically stringify args??
          const params = JSON.stringify(args);
          const key = makeStateKey(`${service}.${method}(${params})`)
          if (this.transferState.hasKey(key)) {
            const res = this.transferState.get(key, null);
            if (res) {
              this.transferState.remove(key);
              return res;
            }
          }
          const req = {
            service: service,
            method: method,
            args: args
          };
          return this.pushQueue(req)
        };
      }
    });
  }

}

export const browserConfig: ApplicationConfig = {
  providers: [
  // TODO: auto generate this
  { provide: BatchClientRequests, useClass: BatchClientRequests, },
  {
    provide: APP_INITIALIZER,
    useFactory: (batch: BatchClientRequests) => {
      return () => batch.init();
    },
    deps: [BatchClientRequests],
    multi: true,
  },
  {
    provide: ExampleService,
    useFactory: (batch: BatchClientRequests) => batch.createProxy('ExampleService'),
    deps: [BatchClientRequests]
  }]
};
export const config = mergeApplicationConfig(appConfig, browserConfig);