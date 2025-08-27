import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
