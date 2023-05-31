/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

import { TransferState } from './home/ServerService/TransferState' ;
import { ExampleService } from './home/ServerService/example.service.browser';
import { ExampleService as ExampleServiceServer } from './home/ServerService/example.service.server';

import { ReflectiveInjector } from 'injection-js';

export const transferState = new TransferState();

// TODO: better angular di control
// TODO: auto generate this
export const injector = ReflectiveInjector.resolveAndCreate([
  { provide: TransferState, useValue: transferState},
  { provide: ExampleServiceServer, useClass: ExampleServiceServer },
  { provide: ExampleService, useExisting: ExampleServiceServer },
  { provide: 'ExampleService', useExisting: ExampleServiceServer }
]);

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // TODO: auto generate this
    { provide: ExampleService, useFactory: () => injector.get(ExampleService) }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
