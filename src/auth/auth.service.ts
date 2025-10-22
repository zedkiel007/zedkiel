// Custom AuthService for authentication logic in NestJS.
// - Handles user validation, login, logout, and token refresh.
// - Uses bcrypt for password hashing and jsonwebtoken for refresh tokens.
// - Integrates with UsersService for user data and JwtService for JWT handling.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            return null;
        }
        const isValid = await bcrypt.compare(pass, user.password);
        if (isValid) {
            return { id: user.id, username: user.username, role: user.role };
        }
        return null;
    }

    async login(user: { id: number; username: string; role: string }) {
        const payload = { sub: user.id, username: user.username, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        // create refresh token using separate secret so you can revoke access by changing refresh secret
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
        });

        // store refresh token in db (plain text or hashed)
        // **better practice: store hash of refresh token before storing. Here we'll store plain for simplicity.**
        await this.usersService.setRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
            // check user
            const user = await this.usersService.findById(decoded.sub);
            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            // check stored token matches
            const storedTokenRow = await this.usersService.findByRefreshToken(user.id);
            const storedToken = storedTokenRow?.refresh_token;
            if (storedToken !== refreshToken) {
                // If it doesn't match, somebody tried to use it.
                // We need to invalidate all refresh tokens for this user.
                await this.usersService.setRefreshToken(user.id, null);
                throw new UnauthorizedException('Invalid refresh token');
            }

            // If everything is OK, generate new tokens
            const payload = { sub: user.id, username: user.username, role: user.role };
            const newAccessToken = this.jwtService.sign(payload);
            const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
            });

            await this.usersService.setRefreshToken(user.id, newRefreshToken);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new UnauthorizedException('Could not refresh tokens');
        }
    }
}