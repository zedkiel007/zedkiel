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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
// Custom UsersController for user management endpoints in NestJS.
// - Handles CRUD operations for users (get, create, update, delete).
// - Integrates with UsersService for business logic.
// - JwtAuthGuard usage is available for route protection.
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    // Get all users (protected)
    // @UseGuards(JwtAuthGuard)
    async getAll() {
        return this.usersService.getAll();
    }
    // Get single user by ID (protected)
    // @UseGuards(JwtAuthGuard)
    async getOne(id) {
        return this.usersService.findById(+id);
    }
    // Create user (open - for demo)
    async create(body) {
        return this.usersService.createUser(body.username, body.password);
    }
    // Update user (protected)
    // @UseGuards(JwtAuthGuard)
    async update(id, body) {
        return this.usersService.updateUser(+id, body);
    }
    // Delete user (protected)
    // @UseGuards(JwtAuthGuard)
    async remove(id) {
        return this.usersService.deleteUser(+id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
