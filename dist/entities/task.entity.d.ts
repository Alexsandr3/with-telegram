import { User } from "./user.entity";
export declare class Task {
    id: number;
    idTelegram: number;
    title: string;
    isCompleted: boolean;
    user: User;
    constructor(id: number, idTelegram: number, title: string, user: User);
    static createTask(id: number, idTelegram: number, title: string, user: User): Task;
    updateTask(title: string): void;
    isCompletedTask(): void;
}
