// Contains business logic and database operations for positions.
// Returns structured data used by the controller.
//I edit this file to add a new method for updating positions.


import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket } from 'mysql2';

export interface Position {
  id: number;
  position_code: string;
  position_name: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class PositionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Position[]> {
    const [rows] = await this.db.getPool().query<RowDataPacket[]>(
      'SELECT * FROM positions'
    );
    return rows as Position[];
  }

  async findOne(id: number): Promise<Position | null> {
    const [rows] = await this.db.getPool().query<RowDataPacket[]>(
      'SELECT * FROM positions WHERE id = ?',
      [id]
    );
    return (rows as Position[]).length ? (rows as Position[])[0] : null;
  }

  async create(data: { position_code: string; position_name: string }): Promise<Position> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result]: any = await this.db.getPool().execute(
      'INSERT INTO positions (position_code, position_name, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [data.position_code, data.position_name, now, now]
    );

    const id = result.insertId;
    return {
      id,
      position_code: data.position_code,
      position_name: data.position_name,
      created_at: now,
      updated_at: now,
    };
  }

  async update(id: number, updateData: Partial<Position>): Promise<Position | null> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await this.db.getPool().execute(
      'UPDATE positions SET position_code = ?, position_name = ?, updated_at = ? WHERE id = ?',
      [updateData.position_code, updateData.position_name, now, id]
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<Position | null> {
    const position = await this.findOne(id);
    if (!position) return null;
    await this.db.getPool().execute('DELETE FROM positions WHERE id = ?', [id]);
    return position;
  }
}
