import { TestingService } from './testing.service';
export declare class TestingController {
    protected testingService: TestingService;
    constructor(testingService: TestingService);
    deleteDB(): Promise<void>;
}
