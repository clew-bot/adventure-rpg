import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const user = await this.userService.createUser(email, password);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && user.password === password) {
      const payload = { username: user.email, id: user.id };
      console.log('payload: ', payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateToken(token: string): Promise<User> {
    const payload = this.jwtService.verify(token);
    const user = await this.userService.getUserByEmail(payload.username);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
