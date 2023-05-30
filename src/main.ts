import 'zone.js/dist/zone';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app.component';

// ez document ready
requestAnimationFrame(() => {
  bootstrapApplication(App);
});
