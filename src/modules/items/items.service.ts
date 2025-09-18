import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationArgs } from 'src/common/dto';
import { paginate } from 'src/common/utils/pagination.util';
import { User } from '../users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(data: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    newItem.user = user;
    return await this.itemRepository.save(newItem);
  }

  async update(data: UpdateItemInput, user: User): Promise<Item> {
    const { id, ...changes } = data;
    const item = await this.findOne(id, user);
    this.itemRepository.merge(item, changes);
    return await this.itemRepository.save(item);
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<Item[]> {
    const { skip, take } = paginate(paginationArgs);
    return await this.itemRepository.find({
      where: { userId: user.id },
      relations: ['user'],
      skip,
      take,
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id, userId: user.id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.user = user;
    return item;
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemRepository.delete(id);
    return item;
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({ where: { userId: user.id } });
  }
}
