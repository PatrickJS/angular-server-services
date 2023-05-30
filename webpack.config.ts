import { Configuration, DefinePlugin } from 'webpack';
import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';

import * as pkg from './package.json';

export default (
  cfg: Configuration,
  opts: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  cfg?.plugins?.push(
    new DefinePlugin({
      APP_VERSION: JSON.stringify(pkg.version),
    })
  );

  return cfg;
};