import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CqrsModule, JwtModule.register({})],
})
export class PublicModule {}
