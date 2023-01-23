import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../entities/user.entity";


@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteAll() {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager
          .delete(User, {});
      })
      .catch((e) => {
        return console.log(e);
      });
    return;
  }
}
