import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleService } from './ServerService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent {
  exampleService = inject(ExampleService);
  example = this.exampleService.getTodo({id: 1});
  // @ts-ignore
  APP_VERSION = APP_VERSION;

}
