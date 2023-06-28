import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}
  async initGame(email: any) {
    console.log('email: ', email);
    const mainUser = await this.prisma.user.findUnique({ where: { email } });
    console.log('mainUser: ', mainUser);
    return mainUser;
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
