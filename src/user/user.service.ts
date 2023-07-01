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
        hitpoints: 10,
        gameStarted: false,
        balance: 100,
      },
    });

    const newStats = {
      data: {
        level: 1,
        xp: 0,
        user: {
          connect: { id: newUser.id },
        },
      },
    };
    const createdUser = this.prisma.$transaction([
      this.prisma.woodcutting.create(newStats),
      this.prisma.mining.create(newStats),
      this.prisma.fishing.create(newStats),
      this.prisma.combat.create(newStats),
      this.prisma.magic.create(newStats),
      this.prisma.cooking.create(newStats),
    ]);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
}
