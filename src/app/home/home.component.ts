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

  // defined in webpack
  // @ts-ignore
  APP_VERSION = APP_VERSION;
}