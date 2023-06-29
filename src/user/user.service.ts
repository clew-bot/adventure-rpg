import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        woodcutting: 1,
        mining: 1,
        cooking: 1,
        combat: 1,
        fishing: 1,
        magic: 1,
        hitpoints: 10,
        gameStarted: false,
        balance: 100,
      },
    });
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
}
