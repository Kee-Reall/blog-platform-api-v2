import { Contract } from './contract.class';

export class CreationContract<
  T extends { id: number; code: string } = any,
> extends Contract<T> {
  public getPayloadId() {
    return this.payload.id;
  }

  public setId(id: number) {
    const payload = { id: id } as T;
    this.setPayload(payload);
  }

  public setCode(confirmationCode: string) {
    this.payload.code = confirmationCode;
  }

  public getPayloadCode(): string {
    return this.payload.code;
  }
}
