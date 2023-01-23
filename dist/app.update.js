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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUpdate = void 0;
const app_service_1 = require("./app.service");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_buttons_1 = require("./app.buttons");
const context_interface_1 = require("./context.interface");
const app_utilits_1 = require("./app.utilits");
const user_entity_1 = require("./entities/user.entity");
const users_repositories_1 = require("./repositories/users-repositories");
const todos = [
    { id: 1, title: 'Купить марковку 🥕', isCompleted: false },
    { id: 2, title: 'Пойти на прогулку 👀', isCompleted: false },
    { id: 3, title: 'Поиграйть со смной )) 🙏🏼', isCompleted: false },
];
let AppUpdate = class AppUpdate {
    constructor(bot, appService, usersRepositories) {
        this.bot = bot;
        this.appService = appService;
        this.usersRepositories = usersRepositories;
    }
    async startCommand(ctx) {
        const idTelegram = ctx.from.id;
        const firstName = ctx.from.first_name;
        await ctx.reply('Hi! My good Friend 🦝');
        await ctx.reply('Что ты хочешь делать?', (0, app_buttons_1.actionButtons)());
        const user = await user_entity_1.User.createUser(idTelegram, firstName);
        await this.usersRepositories.saveUser(user);
    }
    async listTask(ctx) {
        console.log('-----', ctx);
        await ctx.replyWithHTML((0, app_utilits_1.showList)(ctx, todos));
    }
    async doneTask(ctx) {
        ctx.session.type = 'done';
        await ctx.reply('Напиши ID задания:');
    }
    async editTask(ctx) {
        ctx.session.type = 'edit';
        await ctx.deleteMessage();
        await ctx.replyWithHTML('Напиши ID задания: и новое название задачи: \n\n' +
            'В формате: <b>1_Новое название</b>');
    }
    async addTask(ctx) {
        ctx.session.type = 'add';
        await ctx.deleteMessage();
        await ctx.replyWithHTML('Напиши ID задания: и новое название задачи: \n\n' +
            'В формате: <b>1_Новое название</b>');
    }
    async deleteTask(ctx) {
        ctx.session.type = 'remove';
        await ctx.reply('Напиши ID задания:');
    }
    async getMessage(message, ctx) {
        if (!ctx.session.type)
            return;
        if (ctx.session.type === 'done') {
            const todo = todos.find(t => t.id === Number(message));
            if (!todo) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            todo.isCompleted = !todo.isCompleted;
            await ctx.replyWithHTML((0, app_utilits_1.showList)(ctx, todos));
        }
        if (ctx.session.type === 'edit') {
            const [taskId, newName] = message.split('_');
            const todo = todos.find(t => t.id === Number(taskId));
            if (!todo) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            todo.title = newName;
            await ctx.replyWithHTML((0, app_utilits_1.showList)(ctx, todos));
        }
        if (ctx.session.type === 'add') {
            const [taskId, newName] = message.split('_');
            const todo = todos.find(t => t.id === Number(taskId));
            if (!todo) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            todo.title = newName;
            await ctx.replyWithHTML((0, app_utilits_1.showList)(ctx, todos));
        }
        if (ctx.session.type === 'remove') {
            const todo = todos.find(t => t.id === Number(message));
            if (!todo) {
                await ctx.deleteMessage();
                await ctx.reply(`Not found with id: ${message}`);
                return;
            }
            const filter = todos.filter(t => t.id !== Number(message));
            await ctx.replyWithHTML((0, app_utilits_1.showList)(ctx, filter));
        }
    }
};
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "startCommand", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📜 Список дел'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "listTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🤪 Выполнено'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "doneTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🖊 Редактировать'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "editTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📌 Добавить'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "addTask", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('❌ Удаление'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deleteTask", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Message)('text')),
    __param(1, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof context_interface_1.Context !== "undefined" && context_interface_1.Context) === "function" ? _g : Object]),
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