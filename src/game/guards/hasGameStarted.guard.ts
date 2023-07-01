// has-started-game.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Observable } from 'rxjs';

@Injectable()
export class HasStartedGameGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    return this.checkGameStarted(userId);
  }

  async checkGameStarted(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user.gameStarted) {
      throw new ForbiddenException(
        'Game has not started yet, use /game/start to start!',
      );
    }
    return user.gameStarted;
  }
}
