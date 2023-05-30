import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TodosService {
  http = inject(HttpClient);

  getTodos() {
    return firstValueFrom(this.http.get<any[]>("https://jsonplaceholder.typicode.com/todos"));
  }
}