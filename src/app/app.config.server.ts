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

import { ExampleService } from './home/ServerService/example.service.browser';
import { ExampleService as ExampleServiceServer } from './home/ServerService/example.service.server';

import { ReflectiveInjector } from 'injection-js';

// TODO: better angular di control
export const injector = ReflectiveInjector.resolveAndCreate([
  { provide: ExampleServiceServer, useClass: ExampleServiceServer },
  { provide: ExampleService, useExisting: ExampleServiceServer },
  { provide: 'ExampleService', useExisting: ExampleServiceServer }
]);

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: ExampleService, useFactory: () => injector.get(ExampleService) }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
