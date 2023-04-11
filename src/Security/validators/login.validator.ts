import { Length } from 'class-validator';

export class LoginInput {
  @Length(3, 100)
  loginOrEmail: string;

  @Length(6, 20)
  password: string;
}
