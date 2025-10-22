// Registers the PositionsController and PositionsService.
// Bundles all position-related functionality into a cohesive module.


import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}