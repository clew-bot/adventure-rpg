import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('start')
  async startGame(@Req() req: RequestWithUser) {
    const userId = req.user.email; // assuming 'user' contains 'id' field
    console.log('UserId: ', userId);
    return await this.gameService.initGame(userId);
  }
}
