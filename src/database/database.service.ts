// Custom DatabaseService for managing a MySQL connection pool in NestJS.
// - Loads DB config from environment variables using dotenv.
// - Implements OnModuleInit/OnModuleDestroy for lifecycle management.
// - Provides a getPool() method for dependency injection in other services.
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    pool!: mysql.Pool;

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
}