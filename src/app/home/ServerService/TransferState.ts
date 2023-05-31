import { Injectable } from "injection-js";

// TODO: implement TransferState
@Injectable()
export class TransferState {
  _state: any = {};
  get(key: string) {
    return this._state[key];
  }
  set(key: string, value: any) {
    return this._state[key] = value;
  }
}
