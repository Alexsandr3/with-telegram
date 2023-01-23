"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_update_1 = require("./users/app.update");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const LocalSession = require("telegraf-session-local");
const typeorm_1 = require("@nestjs/typeorm");
const users_repositories_1 = require("./users/repositories/users-repositories");
const user_entity_1 = require("./entities/user.entity");
const users_controller_1 = require("./users/users.controller");
const testing_module_1 = require("./testing/testing.module");
const task_entity_1 = require("./entities/task.entity");
const session = new LocalSession({ database: 'session_db.json' });
const entities = [
    user_entity_1.User,
    task_entity_1.Task
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.getConfiguration] }),
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const token = configService.get('tokens', { infer: true });
                    return {
                        middlewares: [session.middleware()],
                        token: token.TOKEN_TELEGRAM
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const database = configService.get('database', { infer: true });
                    return {
                        type: 'postgres',
                        entities: [...entities],
                        url: database.PGSQL_ELEPHANT_URI,
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([...entities]),
            testing_module_1.TestingModule,
        ],
        providers: [app_service_1.AppService, app_update_1.AppUpdate, users_repositories_1.UsersRepositories],
        controllers: [users_controller_1.UsersController],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map