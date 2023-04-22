import { Nullable } from '../../../Model';

export class Contract<T> {
  protected payload: Nullable<T>;
  protected status: boolean;
  protected statusHadBeenSet: boolean;
  protected code: number;
  constructor(defaultStatus?: boolean) {
    this.status = defaultStatus ? defaultStatus : false;
    this.payload = null;
    this.statusHadBeenSet = false;
  }

  public setSuccess() {
    if (this.statusHadBeenSet) {
      throw new Error('status already set');
    }
    this.statusHadBeenSet = true;
    this.status = true;
    this.code = 0;
  }

  public setFailed(code?: number) {
    if (this.statusHadBeenSet) {
      throw new Error('status already set');
    }
    this.statusHadBeenSet = true;
    this.status = false;
    if (code) {
      this.code = code;
    }
  }

  public isSuccess(): boolean {
    if (!this.statusHadBeenSet) {
      throw new Error('status has not set');
    }
    return this.status === true;
  }

  public isFailed(): boolean {
    if (!this.statusHadBeenSet) {
      throw new Error('status has not set');
    }
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
