import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { paginate } from 'src/common/utils/pagination.util';
import { CreateUserInput, FindAllArgs, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async create(data: CreateUserInput): Promise<User> {
    await this.validateEmailAviable(data.email);
    const newUser = this.userRepository.create(data);
    newUser.password = await bcrypt.hash(data.password, 10);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll(findAllArgs: FindAllArgs): Promise<User[]> {
    const { search, roles } = findAllArgs;
    const { skip, take } = paginate(findAllArgs);

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy');
    if (roles.length > 0) {
      query.andWhere('user.roles && :roles', { roles });
    }
    if (search) {
      query.andWhere('user.fullName ILIKE :search', {
        search: `%${search}%`,
      });
    }
    return query.skip(skip).take(take).getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { updatedBy: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      this.userRepository.merge(user, { updatedBy, ...updateUserInput });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con id ${id}`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: string) {
    throw new NotImplementedException('Method not implemented.');
  }

  async block(id: string, updatedBy: User): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    user.updatedBy = updatedBy;
    await this.userRepository.save(user);
    return user;
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

  private async validateEmailAviable(email: string): Promise<void> {
    const userEmail = await this.userRepository.findOneBy({ email });
    if (userEmail) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }
  }
}
