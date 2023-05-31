import * as isBrowser from 'is-browser';
import { ExampleService as ExampleServiceServer } from './example.service.server';
import { ExampleService as ExampleServiceBrowser } from './example.service.browser';

export const ExampleService: typeof ExampleServiceServer = ExampleServiceBrowser;