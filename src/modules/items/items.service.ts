import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateItemInput } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(data: CreateItemInput): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    return await this.itemRepository.save(newItem);
  }

  // update(id: number, updateItemInput: UpdateItemInput) {
  //   return `This action updates a #${id} item`;
  // }

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
