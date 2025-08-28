import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

interface IUserService {
  create(createUserInput: CreateUserInput): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  // update(id: string, updateUserInput: UpdateUserInput): Promise<User>;
  // remove(id: string): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserInput) {
    await this.validateEmailAviable(data.email);
    const newUser = this.userRepository.create(data);
    newUser.password = await bcrypt.hash(data.password, 10);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    throw new NotImplementedException('Method not implemented.');
  }

  remove(id: string) {
    throw new NotImplementedException('Method not implemented.');
  }

  async findOneByEmail(email: string) {
    const userEmail = await this.userRepository.findOneBy({ email });
    if (!userEmail) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return userEmail;
  }

  private async validateEmailAviable(email: string) {
    const userEmail = await this.userRepository.findOneBy({ email });
    if (userEmail) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }
  }
}
