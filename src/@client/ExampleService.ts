import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ExampleService {
  async getTodo(options: { id: number }): Promise<any> {}
}
