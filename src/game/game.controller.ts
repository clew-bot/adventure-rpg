import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';
import { HasStartedGameGuard } from './guards/hasGameStarted.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('start')
  async startGame(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.gameService.initGame(userId);
  }

  @UseGuards(AuthGuard('jwt'), HasStartedGameGuard)
  @Get('stats')
  async getStats(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.gameService.getStats(userId);
  }

  @UseGuards(AuthGuard('jwt'), HasStartedGameGuard)
  @Get('chop')
  async chop(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const woodUser = await this.gameService.getWoodcuttingLevel(userId);
    return await this.gameService.chop(woodUser);
  }
}
