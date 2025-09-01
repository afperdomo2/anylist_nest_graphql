import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserInput, FindAllArgs, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';

interface IUserService {
  getTotalUsers(): Promise<number>;
  create(createUserInput: CreateUserInput): Promise<User>;
  findAll(findAllArgs: FindAllArgs): Promise<User[]>;
  findOne(id: string): Promise<User>;
  // update(id: string, updateUserInput: UpdateUserInput): Promise<User>;
  // remove(id: string): Promise<User>;
  findOneByEmailWithPassword(email: string): Promise<User>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async create(data: CreateUserInput) {
    await this.validateEmailAviable(data.email);
    const newUser = this.userRepository.create(data);
    newUser.password = await bcrypt.hash(data.password, 10);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll(filters: FindAllArgs) {
    const { roles } = filters;
    if (roles.length > 0) {
      // Para filtrar arrays en PostgreSQL, usamos QueryBuilder con el operador && (overlap)
      return this.userRepository
        .createQueryBuilder('user')
        .where('user.roles && :roles', { roles })
        .getMany();
    }
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, updateUserInput: UpdateUserInput) {
    throw new NotImplementedException('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: string) {
    throw new NotImplementedException('Method not implemented.');
  }

  /**
   * Método específico para autenticación que SÍ incluye el password
   * Solo debe usarse internamente para validar credenciales
   */
  async findOneByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  private async validateEmailAviable(email: string) {
    const userEmail = await this.userRepository.findOneBy({ email });
    if (userEmail) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }
  }
}
