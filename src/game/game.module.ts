// game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService], // export GameService
  imports: [PrismaModule], // import PrismaModule
})
export class GameModule {}
