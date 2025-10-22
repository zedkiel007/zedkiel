// - Injects UsersService for user registration.
// - Provides /auth/register, /auth/login, /auth/logout, /auth/refresh endpoints.

import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    // Added for GET /auth/users route to return all users
    @Get('users')
    async getAllUsers() {
        return this.usersService.getAll();
    }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        return this.usersService.createUser(body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            return { error: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @Post('logout')
    logout(@Body() body: { userId: number }) {
        return this.authService.logout(body.userId);
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}