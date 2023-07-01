import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import levels from '../json/levels.json';
import trees from '../json/tree.json';
@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}
  async initGame(id: any) {
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

  async chop(userId: string) {
    const xpGain = this.gainExperience(userId, 'Oak');
    return xpGain;
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

  async gainExperience(user: any, treeName: string) {
    const tree = trees.find((tree: any) => tree.name === treeName);

    if (!tree) {
      throw new Error('Tree not found');
    }

    if (user.woodcuttingLevel < tree.level) {
      throw new Error('Your woodcutting level is too low for this tree');
    }

    // Increase the user's woodcutting experience
    let newExperience = user.woodcuttingExperience + tree.experience;
    const currentLevel = levels.find(
      (level: any) => level.level === user.woodcuttingLevel,
    );
    const nextLevel = levels.find(
      (level: any) => level.level === user.woodcuttingLevel + 1,
    );

    if (!nextLevel) {
      throw new Error('Maximum level reached');
    }

    // Check if the new experience is enough for the next level
    if (newExperience >= nextLevel.experience) {
      // Level up and carry over the leftover experience
      user.woodcuttingLevel += 1;
      newExperience -= nextLevel.experience;
    }

    user.woodcuttingExperience = newExperience;

    // Update the user in the database
    await this.prisma.woodcutting.update({
      where: {
        userId: user.id,
      },
      data: {
        level: user.woodcuttingLevel,
        xp: user.woodcuttingExperience,
      },
    });

    return user;
  }
}
