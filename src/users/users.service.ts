import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    userCrudOrmRepo: Repository<User>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userCrudOrmRepo);
  }

  async save(id: string, email: string): Promise<User> {
    return this.userRepository.save({
      id,
      email,
    });
  }
}
