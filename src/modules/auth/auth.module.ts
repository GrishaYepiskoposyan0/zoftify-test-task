import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingModule } from '../../common/utils/hashing/hashing.module';

@Module({
  imports: [HashingModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
