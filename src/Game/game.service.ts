import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}
  async initGame(): Promise<string> {
    return 'Hello World!';
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
