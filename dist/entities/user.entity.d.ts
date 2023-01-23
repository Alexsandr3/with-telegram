import { Task } from "./task.entity";
export declare class User {
    id: number;
    idTelegram: number;
    firstName: string;
    lastName: string;
    createdAt: Date;
    tasks: Task[];
    constructor(idTelegram: number, firstName: string, lastName?: string);
    static createUser(idTelegram: number, firstName: string, lastName?: string): User;
}
