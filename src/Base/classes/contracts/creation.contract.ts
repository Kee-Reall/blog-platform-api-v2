// export class CreationContract {
//   private payload: { id: number; code?: string };
//   private status: boolean;
//
//   constructor() {
//     this.status = true;
//     this.payload = { id: -1 };
//   }
//
//   public setSuccess() {
//     this.status = true;
//   }
//
//   public setFailed() {
//     this.status = false;
//   }
//
//   public getStatus() {
//     return this.status && this.payload.id > 0;
//   }
//
//   public getId() {
//     return this.payload.id;
//   }
//
//   public setId(id: number) {
//     this.payload.id = id;
//   }
//
//   public isSuccess(): boolean {
//     return this.status === true;
//   }
//
//   public isFailed(): boolean {
//     return this.status === false;
//   }
//
//   public setCode(code: string) {
//     this.payload.code = code;
//   }
//
//   public getCode(): string {
//     return this.payload.code;
//   }
// }

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
