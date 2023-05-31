# Angular Server Services
This project presents an example of Angular Server Services implementation, utilizing proxying for client services to make RPC (Remote Procedure Calls) to the server service. The goal of this example is to demonstrate how easily these services can be auto-generated, potentially reducing half of your existing codebase.


Please note, we are currently using injection-js to bypass the Angular injector and micotask to force zone.js to wait on the server-side. This workarounds are only needed  to workaround how Angular bootstraps and manages the apps on the server. I am also creating my own TransferState service just for this demo.

Angular can easily support this pattern in Angular Universal with little effort.

