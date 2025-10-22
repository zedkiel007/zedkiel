"use strict";
// Contains business logic and database operations for positions.
// Returns structured data used by the controller.
//I edit this file to add a new method for updating positions.
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
exports.PositionsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let PositionsService = class PositionsService {
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        const [rows] = await this.db.getPool().query('SELECT * FROM positions');
        return rows;
    }
    async findOne(id) {
        const [rows] = await this.db.getPool().query('SELECT * FROM positions WHERE id = ?', [id]);
        return rows.length ? rows[0] : null;
    }
    async create(data) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [result] = await this.db.getPool().execute('INSERT INTO positions (position_code, position_name, created_at, updated_at) VALUES (?, ?, ?, ?)', [data.position_code, data.position_name, now, now]);
        const id = result.insertId;
        return {
            id,
            position_code: data.position_code,
            position_name: data.position_name,
            created_at: now,
            updated_at: now,
        };
    }
    async update(id, updateData) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await this.db.getPool().execute('UPDATE positions SET position_code = ?, position_name = ?, updated_at = ? WHERE id = ?', [updateData.position_code, updateData.position_name, now, id]);
        return this.findOne(id);
    }
    async remove(id) {
        const position = await this.findOne(id);
        if (!position)
            return null;
        await this.db.getPool().execute('DELETE FROM positions WHERE id = ?', [id]);
        return position;
    }
};
exports.PositionsService = PositionsService;
exports.PositionsService = PositionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PositionsService);
