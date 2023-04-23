import { Nullable } from '../../../Model';

export class Contract<T> {
  protected payload: Nullable<T>;
  protected status: boolean;
  protected code: number;
  constructor(defaultStatus = false) {
    this.status = defaultStatus;
    this.payload = null;
  }

  public setSuccess() {
    this.status = true;
    this.code = 0;
  }

  public setFailed(code?: number) {
    this.status = false;
    if (code) {
      this.code = code;
    }
  }

  public isSuccess(): boolean {
    return this.status === true;
  }

  public isFailed(): boolean {
    return this.status === false;
  }

  public getPayload(): T {
    if (this.payload === null) {
      throw new Error('payload is not defined');
    }
    return this.payload;
  }

  public setPayload(payload: T): void {
    this.payload = payload;
  }

  public isCode(code: number): boolean {
    if (isNaN(code)) {
      throw new Error('code should be a number');
    }
    return this.code === code;
  }
}
