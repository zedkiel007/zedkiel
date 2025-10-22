// Custom JwtAuthGuard for protecting routes with JWT authentication in NestJS.
// - Extends Passport's AuthGuard with the 'jwt' strategy.
// - Optionally overrides canActivate for custom logic or logging.
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
