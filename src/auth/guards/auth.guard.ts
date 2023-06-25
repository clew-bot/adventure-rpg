import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // import AuthService to validate token

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {} // Inject AuthService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract token from headers
    const token = request.headers.authorization?.split(' ')[1];

    // Validate token and attach user to request object
    if (token) {
      const user = this.authService.validateToken(token);
      if (user) {
        request.user = user;
        return true;
      }
    }

    return false;
  }
}
