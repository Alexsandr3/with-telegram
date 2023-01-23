import { Context } from "../types/context.interface";
import { Task } from "../entities/task.entity";
export declare const showTasks: (ctx: Context, todos: Task[]) => string;
