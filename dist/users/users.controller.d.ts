import { UsersRepositories } from "./repositories/users-repositories";
import { User } from "../entities/user.entity";
export declare class UsersController {
    private readonly usersRepositories;
    constructor(usersRepositories: UsersRepositories);
    findAll(): Promise<User[]>;
}
