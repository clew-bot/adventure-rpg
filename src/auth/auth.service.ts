import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/user.service';
import { User } from '@prisma/client'; // import User entity

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    // The user creation logic will depend on how you've setup your UserService
    const user = await this.userService.createUser(email, password);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && user.password === password) {
      // Ensure secure comparison in production
      const payload = { username: user.email, id: user.id };
      console.log('payload: ', payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
