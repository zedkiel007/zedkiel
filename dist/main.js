"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 26431;
    app.enableCors();
    await app.listen(port);
    console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
