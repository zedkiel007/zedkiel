//Defines RESTful endpoints for managing positions.
//Formats responses to match frontend expectations (e.g., position_id instead of id).
//Most stressing part to connect this to positions.service.ts so I modified both files.
 
 


import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PositionsService, Position } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll(): Promise<
    {
      position_id: number;
      id: number;
      position_name: string;
      created_at: string;
      updated_at: string;
    }[]
  > {
    console.log('GET /positions triggered');
    const positions = await this.positionsService.findAll();
    return positions.map((pos) => ({
      position_id: pos.id,
      id: pos.id,
      position_name: pos.position_name,
      created_at: pos.created_at,
      updated_at: pos.updated_at,
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<{
    position_id: number;
    id: number;
    position_name: string;
    created_at: string;
    updated_at: string;
  }> {
    console.log(`GET /positions/${id} triggered`);
    const position = await this.positionsService.findOne(+id);
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return {
      position_id: position.id,
      id: position.id,
      position_name: position.position_name,
      created_at: position.created_at,
      updated_at: position.updated_at,
    };
  }

  @Post()
@HttpCode(201)
async create(
  @Body() positionData: { position_code: string; position_name: string }
): Promise<{
  position_id: number;
  position_code: string;
  position_name: string;
}> {
  console.log('POST /positions triggered', positionData);
  // basic validation
  if (!positionData || !positionData.position_code || !positionData.position_name) {
    throw new BadRequestException('position_code and position_name are required');
  }

  try {
    const created = await this.positionsService.create(positionData);
    return {
      position_id: created.id, // maps internal id to frontend-friendly position_id
      position_code: created.position_code,
      position_name: created.position_name,
    };
  } catch (err) {
    // log server-side for debugging
    console.error('Error creating position:', err);
    throw new InternalServerErrorException('Failed to create position');
  }
}


  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: { position_code: string; position_name: string }
  ): Promise<{ message: string }> {
    console.log(`PUT /positions/${id} triggered`, updateData);
    const updated = await this.positionsService.update(+id, updateData);
    if (!updated) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return { message: 'Position updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    console.log(`DELETE /positions/${id} triggered`);
    const deleted = await this.positionsService.remove(+id);
    if (!deleted) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return { message: 'Position deleted successfully' };
  }
}