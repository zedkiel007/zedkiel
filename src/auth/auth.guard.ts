// Custom JwtAuthGuard to enable JWT-based authentication using Passport in NestJS.
// Extends the built-in AuthGuard with the 'jwt' strategy for route protection.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}