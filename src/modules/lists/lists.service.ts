import { ILike, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { paginate } from 'src/common/utils/pagination.util';
import { User } from '../users/entities/user.entity';
import { CreateListInput, FindAllListsArgs, UpdateListInput } from './dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,
  ) {}

  async create(data: CreateListInput, user: User) {
    const newList = this.listRepository.create(data);
    newList.user = user;
    return await this.listRepository.save(newList);
  }

  async update(data: UpdateListInput, user: User) {
    const { id, ...changes } = data;
    const list = await this.findOne(id, user);
    this.listRepository.merge(list, changes);
    return await this.listRepository.save(list);
  }

  async findAll(user: User, findAllArgs: FindAllListsArgs) {
    const { search } = findAllArgs;
    const { skip, take } = paginate(findAllArgs);

    const filterByName = search ? { name: ILike(`%${search}%`) } : {};

    return await this.listRepository.find({
      where: { userId: user.id, ...filterByName },
      relations: ['user'],
      skip,
      take,
    });
  }

  async findOne(id: string, user: User) {
    const list = await this.listRepository.findOneBy({ id, userId: user.id });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    list.user = user;
    return list;
  }

  async remove(id: string, user: User) {
    const list = await this.findOne(id, user);
    await this.listRepository.delete(id);
    return list;
  }

  itemCountByUser(user: User): Promise<number> {
    return this.listRepository.count({ where: { userId: user.id } });
  }
}
