export class CreationContract {
  private payload: { id: number };
  private status: boolean;

  constructor() {
    this.status = true;
    this.payload = { id: -1 };
  }

  public setSuccess() {
    this.status = true;
  }

  public setFailed() {
    this.status = false;
  }

  public getStatus() {
    return this.status && this.payload.id > 0;
  }

  public getId() {
    return this.payload.id;
  }

  public setId(id: number) {
    this.payload.id = id;
  }

  public isSuccess(): boolean {
    return this.status === true;
  }

  public isFailed(): boolean {
    return this.status === false;
  }
}
