import { Inject, Injectable } from "injection-js";
import { TransferState } from "./TransferState";
import { HttpClient  } from "@angular/common/http";

@Injectable()
export class ExampleService {
  constructor(
    @Inject(TransferState) public _transferState: TransferState,
    private http: HttpClient
  ) {};
  async getTodo(options: { id: number }) {
    // TODO: zone.js fetch
    const macroTask = Zone.current
      .scheduleMacroTask(
        `WAITFOR-${Math.random()}-${Date.now()}`,
        () => { },
        {},
        () => { }
      );

    const id = options.id
    console.log('server request', id);
    const data = await this.http.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        return json;
      });

    // TODO: zone.js fetch
    // deterministic stringify
    const arg = JSON.stringify(Array.from(arguments));
    this._transferState.set('ExampleService', {
      getTodo: {
        [arg]: data
      }
    });
    macroTask.invoke();
    return data;
  }
}