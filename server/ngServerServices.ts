import {first} from 'rxjs/operators';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import {
  platformServer,
  INITIAL_CONFIG,
  BEFORE_APP_SERIALIZED,
  PlatformState,
  ɵSERVER_CONTEXT as SERVER_CONTEXT,
} from '@angular/platform-server';
import {
  ApplicationRef,
  Renderer2,
  ɵannotateForHydration as annotateForHydration,
  ɵENABLED_SSR_FEATURES as ENABLED_SSR_FEATURES,
  ɵIS_HYDRATION_DOM_REUSE_ENABLED as IS_HYDRATION_DOM_REUSE_ENABLED
} from '@angular/core';

const DEFAULT_SERVER_CONTEXT = 'other';

function sanitizeServerContext(serverContext: string): string {
  const context = serverContext.replace(/[^a-zA-Z0-9\-]/g, '');
  return context.length > 0 ? context : DEFAULT_SERVER_CONTEXT;
}
function appendServerContextInfo(applicationRef: ApplicationRef) {
  const injector = applicationRef.injector;
  let serverContext = sanitizeServerContext(injector.get(SERVER_CONTEXT, DEFAULT_SERVER_CONTEXT));
  const features = injector.get(ENABLED_SSR_FEATURES);
  if (features.size > 0) {
    // Append features information into the server context value.
    serverContext += `|${Array.from(features).join(',')}`;
  }
  applicationRef.components.forEach(componentRef => {
    const renderer = componentRef.injector.get(Renderer2);
    const element = componentRef.location.nativeElement;
    if (element) {
      renderer.setAttribute(element, 'ng-server-context', serverContext);
    }
  });
}
function createServerPlatform(options: {document: string; url: string; platformProviders: any[]}) {
  const extraProviders = options.platformProviders ?? [];
  return platformServer([
    {provide: INITIAL_CONFIG, useValue: {document: options.document, url: options.url}},
    extraProviders
  ]);
}



export async function serverService({
  document,
  req,
  res,
  url,
  bootstrap,
  providers = [],
}: {
  document: string;
  req: any;
  res: any;
  url: string;
  providers: any[];
  bootstrap: () => Promise<ApplicationRef>;
}) {

  const platformProviders = [
    ...providers,
    {
      provide: REQUEST,
      useValue: req,
    },
    {
      provide: RESPONSE,
      useValue: res,
    }
  ];
  const platformRef = createServerPlatform({document, url, platformProviders});
  const applicationRef = await bootstrap();
  // const applicationRef = moduleRef.injector.get(ApplicationRef);
  // return _render(platformRef, applicationRef);
  // const environmentInjector = applicationRef.injector;

  // Block until application is stable.
  await applicationRef.isStable.pipe((first((isStable: boolean) => isStable))).toPromise();

  // const platformState = platformRef.injector.get(PlatformState);
  // if (applicationRef.injector.get(IS_HYDRATION_DOM_REUSE_ENABLED, false)) {
  //   annotateForHydration(applicationRef, platformState.getDocument());
  // }

  // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
  // const callbacks = environmentInjector.get(BEFORE_APP_SERIALIZED, null);
  // if (callbacks) {
  //   const asyncCallbacks: Promise<void>[] = [];
  //   for (const callback of callbacks) {
  //     try {
  //       const callbackResult = callback();
  //       if (callbackResult) {
  //         asyncCallbacks.push(callbackResult);
  //       }
  //     } catch (e) {
  //       // Ignore exceptions.
  //       console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
  //     }
  //   }

  //   if (asyncCallbacks.length) {
  //     for (const result of await Promise.allSettled(asyncCallbacks)) {
  //       if (result.status === 'rejected') {
  //         console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', result.reason);
  //       }
  //     }
  //   }
  // }

  // appendServerContextInfo(applicationRef);
  // const output = platformState.renderToString();
  return {
    invoke(cb: any, Service: any, Method: string, args: any): Promise<void> {
      return cb(applicationRef, Service, Method, args);
    },
    destroy() {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          platformRef.destroy();
          resolve();
        }, 0);
      });
    }
  }
}