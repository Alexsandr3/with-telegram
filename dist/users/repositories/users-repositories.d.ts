import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { Task } from "../../entities/task.entity";
export declare class UsersRepositories {
    private readonly userRepo;
    private readonly taskRepo;
    constructor(userRepo: Repository<User>, taskRepo: Repository<Task>);
    saveUser(createdUser: User): Promise<number>;
    deleteUser(id: string): Promise<boolean>;
    getAll(): Promise<User[]>;
    findUserById(idTelegram: number): Promise<User>;
    findTask(idTelegram: number): Promise<Task[]>;
    saveTask(newTask: Task): Promise<number>;
    findTaskByIdTask(taskId: number): Promise<Task>;
    deleteTask(taskId: number): Promise<boolean>;
}
