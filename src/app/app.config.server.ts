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

import { ExampleService } from '@server/Example.service';


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // TODO: auto generate this
    { provide: ExampleService, useClass: ExampleService }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
