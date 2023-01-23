import { Repository } from 'typeorm';
import { User } from "../entities/user.entity";
export declare class TestingService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    deleteAll(): Promise<void>;
}
