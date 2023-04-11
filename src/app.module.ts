import { Module } from '@nestjs/common';
import { TestingModule } from './Testing/testing.module';
import { SecurityModule } from './Security/security.module';

@Module({
  imports: [TestingModule, SecurityModule],
})
export class AppModule {}
