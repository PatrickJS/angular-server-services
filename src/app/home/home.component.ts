import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleService } from "@client/ExampleService";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent {
  exampleService = inject(ExampleService);
  // request data stream from service
  example = this.exampleService.getTodo({
    id: 1
  });
  example2 = this.exampleService.getTodo({
    id: 2
  });
  example3 = this.exampleService.getTodo({
    id: 3
  });
  example4 = this.exampleService.getTodo({
    id: 4
  });

  // defined in webpack
  // @ts-ignore
  APP_VERSION = APP_VERSION;
}