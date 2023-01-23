import { Repository } from 'typeorm';
import { User } from "../entities/user.entity";
export declare class UsersRepositories {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    saveUser(createdUser: User): Promise<number>;
    deleteUser(id: string): Promise<boolean>;
}
