import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    if (await this.userService.getUserByEmail(email)) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(name, email, hashedPassword);
    const user = await this.userService.createUser(email, hashedPassword, name);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, id: user.id };
      console.log('payload: ', payload);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateToken(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userService.getUserByEmail(payload.username);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
