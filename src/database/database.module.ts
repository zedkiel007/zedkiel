// Custom DatabaseModule for providing a shared MySQL connection pool in NestJS.
// - Registers DatabaseService as a provider and export for dependency injection.
// - Allows other modules to inject and use the database connection easily.
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}