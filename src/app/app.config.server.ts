import { mergeApplicationConfig, ApplicationConfig } from "@angular/core"
import { provideServerRendering } from "@angular/platform-server"

import { ExampleService } from "@client/ExampleService"
import { ExampleService as ExampleServiceServer } from "@server/ExampleService"

import { appConfig } from "./app.config"

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // TODO: auto generate @server/ services
    {
      provide: ExampleServiceServer,
      useClass: ExampleServiceServer,
    },
    {
      provide: ExampleService,
      useExisting: ExampleServiceServer,
    },
  ],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
