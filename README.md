# Angular Server Services 🍑
This project presents an example of Angular Server Services implementation, utilizing proxying for client services to make RPC (Remote Procedure Calls) to the server service. The goal of this example is to demonstrate how easily these services can be auto-generated, potentially reducing half of your existing codebase.

Whats used in the repo:
* Angular 16
* Universal
* Hydration
* NgExpressEngine
* Custom Webpack

Please note, we are currently using injection-js to bypass the Angular injector and micotask to force zone.js to wait on the server-side. This workarounds are only needed  to workaround how Angular bootstraps and manages the apps on the server. I am also creating my own TransferState service just for this demo.

Angular can easily support this pattern in Angular Universal with little effort.

<img alt="Screenshot 2023-05-30 at 7 32 35 PM" src="https://github.com/PatrickJS/angular-server-services/assets/1016365/0650cfff-a0be-479f-a799-d18f3169f8c4">


Initial load uses transfer state. When you navigate to another page the back to Home we will make an RPC to get the updated state

# TODO
- [ ] use webpack to auto-generate ServerServices
