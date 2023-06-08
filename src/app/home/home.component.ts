import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleService } from "@client/ExampleService";


export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  example1 = this.exampleService.getTodo({
    id: randomNumber(1, 5)
  });
  example2 = this.exampleService.getTodo({
    id: randomNumber(5, 10)
  });
  example3 = this.exampleService.getTodo({
    id: randomNumber(10, 15)
  });
  example4 = this.exampleService.getTodo({
    id: randomNumber(15, 20)
  });

  // defined in webpack
  // @ts-ignore
  APP_VERSION = APP_VERSION;
}