"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
// Custom DatabaseService for managing a MySQL connection pool in NestJS.
// - Loads DB config from environment variables using dotenv.
// - Implements OnModuleInit/OnModuleDestroy for lifecycle management.
// - Provides a getPool() method for dependency injection in other services.
const common_1 = require("@nestjs/common");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
let DatabaseService = class DatabaseService {
    async onModuleInit() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'mysql-3b854787-ncf-7115.d.avncloud.com',
            port: Number(process.env.DB_PORT) || 28615,
            user: process.env.DB_USER || 'avnadmin',
            password: process.env.DB_PASSWORD || 'UseYourGivenDBPassword',
            database: process.env.DB_NAME || 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        // optional: test connection
        const conn = await this.pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('MySQL pool created');
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    getPool() {
        return this.pool;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
