// tslint:disable:no-any
export default class Deferred<T> extends Promise<T> {
  private promiseResolve: (value: T) => void;
  private promiseReject: (reason: any) => void; 
  private resolvedState = false;
  private rejectedState = false;
  constructor() {
    super((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });
  }

  resolve(value: T) {
    this.promiseResolve(value);
    this.resolvedState = true;
  }

  reject(reason: any) {
    this.promiseReject(reason);
    this.rejectedState = true;
  }

  get resolved() {
    return this.resolvedState;
  }

  get rejected() {
    return this.rejectedState;
  }
}
