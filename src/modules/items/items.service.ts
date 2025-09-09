import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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

  async update(data: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.preload(data);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return await this.itemRepository.save(item);
  }

  async findAll(user: User): Promise<Item[]> {
    return await this.itemRepository.find({
      where: { userId: user.id },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id, userId: user.id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemRepository.delete(id);
    return item;
  }
}
