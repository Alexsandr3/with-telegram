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
exports.UsersRepositories = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const task_entity_1 = require("../../entities/task.entity");
let UsersRepositories = class UsersRepositories {
    constructor(userRepo, taskRepo) {
        this.userRepo = userRepo;
        this.taskRepo = taskRepo;
    }
    async saveUser(createdUser) {
        const user = await this.userRepo.save(createdUser);
        return user.id;
    }
    async deleteUser(id) {
        await this.userRepo.manager.connection
            .transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .delete()
                .from("user")
                .where("id = :id", { id })
                .execute();
        })
            .catch((e) => {
            return console.log(e);
        });
        return true;
    }
    async getAll() {
        return await this.userRepo.find();
    }
    async findUserById(idTelegram) {
        const user = await this.userRepo.findOneBy({ idTelegram: idTelegram });
        if (!user)
            return null;
        return user;
    }
    async findTask(idTelegram) {
        const tasks = await this.taskRepo.find({
            select: ["id", "title", "isCompleted"],
            where: { idTelegram: idTelegram }
        });
        if (tasks.length == 0)
            return null;
        return tasks;
    }
    async saveTask(newTask) {
        const task = await this.taskRepo.save(newTask);
        return task.id;
    }
    async findTaskByIdTask(taskId) {
        const tasks = await this.taskRepo.findOne({
            select: ["id", "title", "isCompleted"],
            where: { id: taskId }
        });
        if (!tasks)
            return null;
        return tasks;
    }
    async deleteTask(taskId) {
        await this.taskRepo.manager.connection
            .transaction(async (manager) => {
            await manager.delete(task_entity_1.Task, { id: taskId });
        })
            .catch((e) => {
            console.log(e);
            return false;
        });
        return true;
    }
};
UsersRepositories = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersRepositories);
exports.UsersRepositories = UsersRepositories;
//# sourceMappingURL=users-repositories.js.map