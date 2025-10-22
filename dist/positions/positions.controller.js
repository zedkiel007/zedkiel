"use strict";
//Defines RESTful endpoints for managing positions.
//Formats responses to match frontend expectations (e.g., position_id instead of id).
//Most stressing part to connect this to positions.service.ts so I modified both files.
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
exports.PositionsController = void 0;
const common_1 = require("@nestjs/common");
const positions_service_1 = require("./positions.service");
let PositionsController = class PositionsController {
    constructor(positionsService) {
        this.positionsService = positionsService;
    }
    async findAll() {
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
    async findOne(id) {
        console.log(`GET /positions/${id} triggered`);
        const position = await this.positionsService.findOne(+id);
        if (!position) {
            throw new common_1.NotFoundException(`Position with ID ${id} not found`);
        }
        return {
            position_id: position.id,
            id: position.id,
            position_name: position.position_name,
            created_at: position.created_at,
            updated_at: position.updated_at,
        };
    }
    async create(positionData) {
        console.log('POST /positions triggered', positionData);
        // basic validation
        if (!positionData || !positionData.position_code || !positionData.position_name) {
            throw new common_1.BadRequestException('position_code and position_name are required');
        }
        try {
            const created = await this.positionsService.create(positionData);
            return {
                position_id: created.id, // maps internal id to frontend-friendly position_id
                position_code: created.position_code,
                position_name: created.position_name,
            };
        }
        catch (err) {
            // log server-side for debugging
            console.error('Error creating position:', err);
            throw new common_1.InternalServerErrorException('Failed to create position');
        }
    }
    async update(id, updateData) {
        console.log(`PUT /positions/${id} triggered`, updateData);
        const updated = await this.positionsService.update(+id, updateData);
        if (!updated) {
            throw new common_1.NotFoundException(`Position with ID ${id} not found`);
        }
        return { message: 'Position updated successfully' };
    }
    async remove(id) {
        console.log(`DELETE /positions/${id} triggered`);
        const deleted = await this.positionsService.remove(+id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Position with ID ${id} not found`);
        }
        return { message: 'Position deleted successfully' };
    }
};
exports.PositionsController = PositionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "remove", null);
exports.PositionsController = PositionsController = __decorate([
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [positions_service_1.PositionsService])
], PositionsController);
