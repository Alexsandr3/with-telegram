import {Module} from '@nestjs/common';
import {AppUpdate} from './users/app.update';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ConfigType, getConfiguration} from "./config/configuration";
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local'
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersRepositories} from "./users/repositories/users-repositories";
import {User} from "./entities/user.entity";
import { UsersController } from './users/users.controller';
import { TestingModule } from "./testing/testing.module";
import { Task } from "./entities/task.entity";

const session = new LocalSession({database: 'session_db.json'})
const entities = [
  User,
  Task
]

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, load: [getConfiguration]}),
        TelegrafModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => {
                const token = configService.get('tokens', {infer: true});
                return {
                    middlewares: [session.middleware()],
                    token: token.TOKEN_TELEGRAM
                };
            },
        }),
        TypeOrmModule.forRootAsync({
            // imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => {
                const database = configService.get('database', { infer: true });
                return {
                    type: 'postgres',
                    entities: [...entities],
                    url: database.PGSQL_ELEPHANT_URI,
                    autoLoadEntities: true,
                    synchronize: true,
                    // ssl: true,
                };
            },
        }),
        TypeOrmModule.forFeature([...entities]),
        TestingModule,
    ],
    providers: [AppService, AppUpdate, UsersRepositories],
    controllers: [UsersController],
})
export class AppModule {
}
