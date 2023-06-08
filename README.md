# Angular Server Services 🍑

This project presents an example of Angular Server Services implementation, utilizing proxying for client services to make RPC (Remote Procedure Calls) to the server service. The goal of this example is to demonstrate how easily these services can be auto-generated, potentially reducing half of your existing codebase.

Whats used in the repo:
* Angular 16
* Standalone Components
* Universal
* Hydration
* NgExpressEngine
* Custom Webpack

> Please note, we are currently using injection-js to bypass the Angular injector and micotask to force zone.js to wait on the server-side. This workarounds are only needed  to workaround how Angular bootstraps and manages the apps on the server. I am also creating my own TransferState service just for this demo.

## Why

The goal is to replicate GraphQL or RSC by moving all domain logic that lives in these services to the server. We want to do this so we can utilize caching on the server and remove all client code for these services (usually half your codebase)

Angular can easily support this pattern in Angular Universal with little effort.

## Start

```bash
$ npm install
$ npm run dev:ssr
```
go to [localhost ](http://localhost:4200/)

<img alt="Screenshot 2023-05-30 at 7 32 35 PM" src="https://github.com/PatrickJS/angular-server-services/assets/1016365/0650cfff-a0be-479f-a799-d18f3169f8c4">


Initial load uses transfer state. When you navigate to another page the back to Home we will make an RPC to get the updated state

* [/app/home/ServerService/example.service.server.ts](https://github.com/PatrickJS/angular-server-services/blob/main/src/app/home/ServerService/example.service.server.ts): ServerService example
* [/server/main.ts](https://github.com/PatrickJS/angular-server-services/blob/e5deec3011d17c1f7301b848eb3f88d268ea8454/server/main.ts#L36...L45): server RPC endpoint
* [/app/app.config.browser](https://github.com/PatrickJS/angular-server-services/blob/main/src/app/app.config.browser.ts#L10...L38): client RPC requests

If we had Angular support then the api would look like this (a lot less code)
* [branch for ideal api](https://github.com/PatrickJS/angular-server-services/tree/ideal-api)
* [ExampleService](https://github.com/PatrickJS/angular-server-services/blob/ideal-api/src/%40server/Example.service.ts)
* [HomeComponent](https://github.com/PatrickJS/angular-server-services/blob/ideal-api/src/app/home/home.component.ts#L4)

Production ready version
* WIP https://github.com/PatrickJS/angular-server-services/pull/2
* Preview

https://github.com/PatrickJS/angular-server-services/assets/1016365/8b00d775-42c4-4d29-b79a-815906d35d04


# TODO: production ready version
- [x] use webpack to auto-generate ServerServices
- [x] create @server folder in src that will be all server services and components
- [x] use angular TransferState
- [x] batch client requests
- [x] batch server requests
- [ ] server commponents
- [ ] hook into router to batch requests for server components
- [ ] mixed server in client components and vice versa
- [ ] server and client caching
- [ ] UI over http

