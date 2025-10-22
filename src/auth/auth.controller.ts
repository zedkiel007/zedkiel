// Custom AuthController for authentication endpoints.
// - Migrated and merged content from auth.controler.ts for consistency.
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

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
