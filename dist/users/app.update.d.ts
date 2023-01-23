import { AppService } from "../app.service";
import { Telegraf } from "telegraf";
import { Context, TelegramUpdateMessage } from "../types/context.interface";
import { UsersRepositories } from "./repositories/users-repositories";
export declare class AppUpdate {
    private readonly bot;
    private readonly appService;
    private readonly usersRepo;
    constructor(bot: Telegraf<Context>, appService: AppService, usersRepo: UsersRepositories);
    startCommand(ctx: Context): Promise<void>;
    listTask(ctx: Context): Promise<void>;
    doneTask(ctx: Context): Promise<void>;
    editTask(ctx: Context): Promise<void>;
    addTask(ctx: Context): Promise<void>;
    deleteTask(ctx: Context): Promise<void>;
    getTime(ctx: Context): Promise<void>;
    randomPhoto(ctx: Context): Promise<void>;
    getMessage(message: string, ctx: Context, payload: TelegramUpdateMessage): Promise<void>;
}
