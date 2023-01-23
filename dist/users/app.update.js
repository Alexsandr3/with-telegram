"use strict";
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
exports.AppUpdate = void 0;
const app_service_1 = require("../app.service");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_buttons_1 = require("../buttons/app.buttons");
const app_utilits_1 = require("../helpers/app.utilits");
const user_entity_1 = require("../entities/user.entity");
const users_repositories_1 = require("./repositories/users-repositories");
const task_entity_1 = require("../entities/task.entity");
let AppUpdate = class AppUpdate {
    constructor(bot, appService, usersRepo) {
        this.bot = bot;
        this.appService = appService;
        this.usersRepo = usersRepo;
    }
    async startCommand(ctx) {
        const idTelegram = ctx.from.id;
        const firstName = ctx.from.first_name;
        const lastName = ctx.from.last_name;
        const foundUser = await this.usersRepo.findUserById(idTelegram);
        if (foundUser.firstName === "Елена") {
            await ctx.reply("Привет дорогая моя 🦝,Добро похаловать в чат 🗿", (0, app_buttons_1.actionButtons)());
        }
        if (!foundUser) {
            await ctx.reply("Hi! My good Friend 🦝, Welcome to chat 🗿", (0, app_buttons_1.actionButtons)());
            const user = await user_entity_1.User.createUser(idTelegram, firstName, lastName);
            await this.usersRepo.saveUser(user);
        }
        else {
            await ctx.replyWithHTML(`<b>Hi! 👋🏽</b> nice to meet you here: <b>${firstName}</b>`, (0, app_buttons_1.actionButtons)());
        }
    }
    async listTask(ctx) {
        const idTelegram = ctx.from.id;
        const listTasks = await this.usersRepo.findTask(idTelegram);
        if (!listTasks) {
            await ctx.replyWithHTML(`У тебя нет запланированных задач 📝`);
        }
        else {
            await ctx.replyWithHTML((0, app_utilits_1.showTasks)(ctx, listTasks));
        }
    }
    async doneTask(ctx) {
        ctx.session.type = "done";
        await ctx.reply("Напиши ID задания:");
    }
    async editTask(ctx) {
        ctx.session.type = "edit";
        await ctx.deleteMessage();
        await ctx.replyWithHTML("Напиши ID задания: и новое название задачи: \n\n" +
            "В формате: <b>1_Новое название</b>");
    }
    async addTask(ctx) {
        ctx.session.type = "add";
        await ctx.deleteMessage();
        await ctx.replyWithHTML("Напиши ID задания: и новое название задачи: \n\n" +
            "В формате: <b>1_Новое название</b>");
    }
    async deleteTask(ctx) {
        ctx.session.type = "remove";
        await ctx.reply("Напиши ID задания:");
    }
    async getTime(ctx) {
        ctx.session.type = "time";
        await ctx.replyWithHTML(`<b>${new Date().toTimeString().split(" ")[0]}</b>`);
    }
    async randomPhoto(ctx) {
        ctx.session.type = "random";
        await ctx.replyWithPhoto({
            url: "https://picsum.photos/500/600/?random",
            filename: "kitten.jpg"
        });
    }
    async getMessage(message, ctx, payload) {
        if (!ctx.session.type)
            return;
        const idTelegram = ctx.from.id;
        const [taskId, title] = message.split("_");
        if (!taskId) {
            await ctx.deleteMessage();
            await ctx.replyWithHTML(`<b>Sorry</b>, я тупаватый бот 🤖. \n\n     Введите корректные данные`);
            return;
        }
        if (ctx.session.type === "remove") {
            const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
            if (!task) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            await this.usersRepo.deleteTask(Number(taskId));
            const todos = await this.usersRepo.findTask(idTelegram);
            if (!todos) {
                await ctx.deleteMessage();
                await ctx.replyWithHTML(`У тебя нет запланированных задач 📝`);
                return;
            }
            await ctx.replyWithHTML((0, app_utilits_1.showTasks)(ctx, todos));
            return;
        }
        if (ctx.session.type === "done") {
            const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
            if (!task) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            task.isCompletedTask();
            await this.usersRepo.saveTask(task);
            const todos = await this.usersRepo.findTask(idTelegram);
            await ctx.replyWithHTML((0, app_utilits_1.showTasks)(ctx, todos));
            return;
        }
        if (!title) {
            await ctx.deleteMessage();
            await ctx.replyWithHTML(`<b>Sorry</b>, я тупаватый бот 🤖. \n\n     Введите корректные данные`);
            return;
        }
        if (ctx.session.type === "add") {
            const user = await this.usersRepo.findUserById(idTelegram);
            const task = task_entity_1.Task.createTask(Number(taskId), idTelegram, title, user);
            await this.usersRepo.saveTask(task);
            const todo = await this.usersRepo.findTask(idTelegram);
            if (!todo) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            await ctx.replyWithHTML((0, app_utilits_1.showTasks)(ctx, todo));
            return;
        }
        if (ctx.session.type === "edit") {
            const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
            if (!task) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            task.updateTask(title);
            await this.usersRepo.saveTask(task);
            const todos = await this.usersRepo.findTask(idTelegram);
            await ctx.replyWithHTML((0, app_utilits_1.showTasks)(ctx, todos));
            return;
        }
        return;
    }
};
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "startCommand", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📜 Список дел"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "listTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🤪 Выполнено"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "doneTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🖊 Редактировать"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "editTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📌 Добавить"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "addTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("❌ Удаление"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deleteTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("⏰ Время"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "getTime", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📸 Random photo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "randomPhoto", null);
__decorate([
    (0, nestjs_telegraf_1.On)("text"),
    __param(0, (0, nestjs_telegraf_1.Message)("text")),
    __param(1, (0, nestjs_telegraf_1.Ctx)()),
    __param(2, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "getMessage", null);
AppUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        app_service_1.AppService,
        users_repositories_1.UsersRepositories])
], AppUpdate);
exports.AppUpdate = AppUpdate;
//# sourceMappingURL=app.update.js.map