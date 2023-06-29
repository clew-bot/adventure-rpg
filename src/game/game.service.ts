import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}
  async initGame(id: any) {
    console.log('id: ', id);
    const updateGameStarted = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        gameStarted: true,
      },
    });
    return updateGameStarted;
  }

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async createUser(
    email: string,
    name: string,
    password: string,
  ): Promise<string> {
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    return user.id;
  }
}
