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
exports.UsersService = void 0;
// Custom UsersService for user management logic in NestJS.
// - Handles user CRUD operations and password hashing.
// - Uses DatabaseService for MySQL queries and bcrypt for security.
// - Provides methods for authentication and token management.
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
        this.pool = () => this.db.getPool();
    }
    async createUser(username, password, role = 'user') {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await this.pool().execute(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, hash, role]);
        return { id: result.insertId, username, role };
    }
    async findByUsername(username) {
        const [rows] = await this.pool().execute(`SELECT id, username, password, role, refresh_token FROM users WHERE username = ?`, [username]);
        return rows[0];
    }
    async findById(id) {
        const [rows] = await this.pool().execute('SELECT id, username, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
    async getAll() {
        const [rows] = await this.pool().execute('SELECT id, username, role, created_at FROM users');
        return rows;
    }
    async updateUser(id, partial) {
        const fields = [];
        const values = [];
        if (partial.username) {
            fields.push('username = ?');
            values.push(partial.username);
        }
        if (partial.password) {
            const hash = await bcrypt.hash(partial.password, 10);
            fields.push('password = ?');
            values.push(hash);
        }
        if (partial.role) {
            fields.push('role = ?');
            values.push(partial.role);
        }
        if (fields.length === 0)
            return await this.findById(id);
        values.push(id);
        const setFields = fields.join(', ');
        await this.pool().execute(`UPDATE users SET ${setFields} WHERE id = ?`, values);
        return this.findById(id);
    }
    async deleteUser(id) {
        const [res] = await this.pool().execute('DELETE FROM users WHERE id = ?', [id]);
        return res.affectedRows > 0;
    }
    async setRefreshToken(id, refreshToken) {
        await this.pool().execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
    }
    async findByRefreshToken(refreshToken) {
        const [rows] = await this.pool().execute('SELECT id, username, role FROM users WHERE refresh_token = ?', [refreshToken]);
        return rows[0];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
