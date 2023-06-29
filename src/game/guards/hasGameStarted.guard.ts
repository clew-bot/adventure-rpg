// has-started-game.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Observable } from 'rxjs';

@Injectable()
export class HasStartedGameGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // assuming 'user' contains 'id' field

    return this.checkGameStarted(userId);
  }

  async checkGameStarted(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user.gameStarted;
  }
}
