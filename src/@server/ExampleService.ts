import { HttpClient } from "@angular/common/http";
import { Injectable, TransferState, inject, makeStateKey } from "@angular/core"
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ExampleService {
  private httpClient = inject(HttpClient);
  private transferState = inject(TransferState);
  async getTodo(options: { id: number }): Promise<any> {

    // TODO: zone.js things
    const macroTask = Zone.current
    .scheduleMacroTask(
      `WAITFOR-${Math.random()}-${Date.now()}`,
      () => {},
      {},
      () => {}
    );

    const id = options.id
    const key = makeStateKey<string>(`ExampleService.getTodo(${JSON.stringify(Array.from(arguments))})`);

    // toPromise() with lastValueFrom() so I can use await
    const data = await lastValueFrom(
      this.httpClient.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
    );
    const json = JSON.stringify(data, null, 2);
    console.log('http response: ', json);

    this.transferState.set(key, data);
    // TODO: zone.js things
    macroTask.invoke();
    return data;
  }
}