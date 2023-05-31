import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

import { ExampleService } from '@server/ExampleService';


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // TODO: auto generate this
    { provide: ExampleService, useClass: ExampleService },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
