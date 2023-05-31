import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';

import { ExampleService } from '@server/Example.service';

export const browserConfig: ApplicationConfig = {
  providers: [
    // TODO: auto generate this
    { provide: ExampleService, useClass: ExampleService}
  ]
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
