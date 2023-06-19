import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService], // Export UserService so that it can be imported by other modules
})
export class UserModule {}
