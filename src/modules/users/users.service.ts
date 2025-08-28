import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

interface IUserService {
  // create(createUserInput: CreateUserInput): Promise<User>;
  // findAll(): Promise<User[]>;
  // findOne(id: string): Promise<User>;
  // update(id: string, updateUserInput: UpdateUserInput): Promise<User>;
  // remove(id: string): Promise<User>;
}

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput) {
    throw new NotImplementedException('Method not implemented.');
  }

  findAll() {
    throw new NotImplementedException('Method not implemented.');
  }

  findOne(id: string) {
    throw new NotImplementedException('Method not implemented.');
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    throw new NotImplementedException('Method not implemented.');
  }

  remove(id: string) {
    throw new NotImplementedException('Method not implemented.');
  }
}
