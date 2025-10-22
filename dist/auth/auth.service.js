"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// Custom AuthService for authentication logic in NestJS.
// - Handles user validation, login, logout, and token refresh.
// - Uses bcrypt for password hashing and jsonwebtoken for refresh tokens.
// - Integrates with UsersService for user data and JwtService for JWT handling.
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
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
    async login(user) {
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
    async logout(userId) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }
    async refreshTokens(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
            // check user
            const user = await this.usersService.findById(decoded.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            // check stored token matches
            const storedTokenRow = await this.usersService.findByRefreshToken(user.id);
            const storedToken = storedTokenRow === null || storedTokenRow === void 0 ? void 0 : storedTokenRow.refresh_token;
            if (storedToken !== refreshToken) {
                // If it doesn't match, somebody tried to use it.
                // We need to invalidate all refresh tokens for this user.
                await this.usersService.setRefreshToken(user.id, null);
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            // If everything is OK, generate new tokens
            const payload = { sub: user.id, username: user.username, role: user.role };
            const newAccessToken = this.jwtService.sign(payload);
            const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
            });
            await this.usersService.setRefreshToken(user.id, newRefreshToken);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Could not refresh tokens');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
