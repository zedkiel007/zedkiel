// Custom JwtStrategy for JWT authentication in NestJS.
// - Extends PassportStrategy to extract and validate JWT from Authorization header.
// - Uses a hardcoded secret for demonstration (replace with env variable in production).
// - Returns user info from JWT payload for request context.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
