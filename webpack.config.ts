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
  cfg?.plugins?.push(
    new DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    }),
    new AngularServerServicePlugin({
      "serverConfig": path.join(__dirname, 'src/app/app.config.server.ts'),
      "serverComponents": [
        "ExampleService"
      ]
    })
  );

  return cfg;
};