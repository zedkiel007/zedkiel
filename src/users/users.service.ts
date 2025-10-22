// Custom UsersService for user management logic in NestJS.
// - Handles user CRUD operations and password hashing.
// - Uses DatabaseService for MySQL queries and bcrypt for security.
// - Provides methods for authentication and token management.
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async createUser(username: string, password: string, role = 'user') {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await this.pool().execute<mysql.OkPacket>(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hash, role],
        );
        return { id: result.insertId, username, role };
    }

    async findByUsername(username: string) {
        const [rows] = await this.pool().execute<mysql.RowDataPacket[]>(
            `SELECT id, username, password, role, refresh_token FROM users WHERE username = ?`,
            [username],
        );
        return rows[0];
    }

    async findById(id: number) {
        const [rows] = await this.pool().execute<mysql.RowDataPacket[]>(
            'SELECT id, username, role, created_at FROM users WHERE id = ?',
            [id],
        );
        return rows[0];
    }

    async getAll() {
        const [rows] = await this.pool().execute<mysql.RowDataPacket[]>(
            'SELECT id, username, role, created_at FROM users',
        );
        return rows;
    }

    async updateUser(id: number, partial: { username?: string; password?: string; role?: string }) {
        const fields: string[] = [];
        const values: any[] = [];
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

        if (fields.length === 0) return await this.findById(id);

        values.push(id);
        const setFields = fields.join(', ');
        await this.pool().execute(`UPDATE users SET ${setFields} WHERE id = ?`, values);
        return this.findById(id);
    }

    async deleteUser(id: number) {
        const [res] = await this.pool().execute<mysql.OkPacket>('DELETE FROM users WHERE id = ?', [id]);
        return res.affectedRows > 0;
    }

    async setRefreshToken(id: number, refreshToken: string | null) {
        await this.pool().execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
    }

    async findByRefreshToken(refreshToken: string) {
        const [rows] = await this.pool().execute<mysql.RowDataPacket[]>(
            'SELECT id, username, role FROM users WHERE refresh_token = ?',
            [refreshToken],
        );
        return rows[0];
    }
}