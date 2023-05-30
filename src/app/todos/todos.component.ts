import { Component, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';

import { TodosService } from './todos.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export default class TodosComponent {
  todos = signal<any[]>([]);
  todosService = inject(TodosService);

  ngOnInit() {
    this.todosService.getTodos().then(todos => {
      console.log('todos', todos.length);
      this.todos.set(todos);
    });
  }
}
