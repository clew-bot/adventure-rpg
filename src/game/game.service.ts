import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import levels from '../json/levels.json';
import trees from '../json/tree.json';
import { Woodcutting } from '@prisma/client';
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

  async chop(userId: Woodcutting) {
    const xpGain = this.gainExperience(userId, 'Oak');
    return xpGain;
  }

  async getWoodcuttingLevel(userId: string) {
    const user = await this.prisma.woodcutting.findUnique({
      where: {
        userId: userId,
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

  async gainExperience(user: Woodcutting, treeName: string) {
    console.log(treeName);
    console.log(trees);
    const tree = trees.find((tree: any) => tree.name === treeName);

    if (!tree) {
      throw new ForbiddenException('Tree not found');
    }

    if (user.level < tree.level) {
      throw new ForbiddenException(
        'Your woodcutting level is too low for this tree',
      );
    }

    // Increase the user's woodcutting experience
    let newExperience = user.xp + tree.experience;
    // const currentLevel = levels.find(
    //   (level: any) => level.level === user.woodcuttingLevel,
    // );
    const nextLevel = levels.find(
      (level: any) => level.level === user.level + 1,
    );

    console.log('nextLevel', nextLevel);
    // if (!nextLevel) {
    //   throw new Error('Maximum level reached');
    // }

    // Check if the new experience is enough for the next level
    if (newExperience >= nextLevel.experience) {
      // Level up and carry over the leftover experience
      user.level += 1;
      newExperience -= nextLevel.experience;
    }

    user.xp = newExperience;

    console.log('updated', user.id);
    // Update the user in the database
    const updated = await this.prisma.woodcutting.update({
      where: {
        id: user.id,
      },
      data: {
        level: user.level,
        xp: user.xp,
      },
    });

    return {
      message: `You gained ${tree.experience} experience and are now level ${user.level}!, You need ${nextLevel.experience} experience to reach level ${nextLevel.level} Current experience: ${user.xp}/${nextLevel.experience}`,
    };
  }
}
