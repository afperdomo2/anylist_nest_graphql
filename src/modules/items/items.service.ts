import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';

interface IItemsService {
  create(data: CreateItemInput): Promise<Item>;
  update(data: UpdateItemInput): Promise<Item>;
  findAll(): Promise<Item[]>;
  findOne(id: string): Promise<Item>;
  // remove(id: string): Promise<void>;
}

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(data: CreateItemInput) {
    const newItem = this.itemRepository.create(data);
    return await this.itemRepository.save(newItem);
  }

  async update(data: UpdateItemInput) {
    const item = await this.itemRepository.preload(data);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return await this.itemRepository.save(item);
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  remove(id: string) {
    return `This action removes a #${id} item`;
  }
}
