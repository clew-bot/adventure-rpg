import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('start')
  startGame(): Promise<string> {
    return this.gameService.initGame();
  }
}
