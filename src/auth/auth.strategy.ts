// Custom JwtStrategy for JWT authentication in NestJS.
// - Extends PassportStrategy to extract and validate JWT from Authorization header.
// - Uses environment variable for secret and supports user roles in payload.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret',
        });
    }

    // payload contains { sub, username, role }
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username, role: payload.role };
    }
}