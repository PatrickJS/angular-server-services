import { Configuration, DefinePlugin } from 'webpack';
import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import * as path from 'path';

import * as pkg from './package.json';
import { AngularServerServicePlugin } from './webpack/AngularServerServicePlugin';


export default (
  cfg: Configuration,
  opts: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  const isServer = targetOptions.target === 'server';
  cfg?.plugins?.push(
    new DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    }),
  );
  // if (!isServer) {
  //   cfg?.plugins?.push(
  //     new AngularServerServicePlugin({
  //       "target": isServer ? 'server' : 'browser',
  //       // TODO: grab server config from angular.json
  //       "serverConfig": path.join(__dirname, 'src/app/app.config.server.ts'),
  //       // TODO: grab all components in @server folder
  //       "serverComponents": [
  //         "ExampleService"
  //       ]
  //     })
  //   );
  // }

  return cfg;
};