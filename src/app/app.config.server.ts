import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // TODO: auto generate @server/ services
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
