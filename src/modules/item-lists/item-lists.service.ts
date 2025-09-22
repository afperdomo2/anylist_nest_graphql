import { Repository } from 'typeorm';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ListsService } from '../lists/lists.service';
import { User } from '../users/entities/user.entity';
import { CreateItemListInput, UpdateItemListInput } from './dto';
import { ItemList } from './entities/item-list.entity';

@Injectable()
export class ItemListsService {
  constructor(
    @InjectRepository(ItemList)
    private itemListRepository: Repository<ItemList>,
    private readonly listsService: ListsService,
  ) {}

  async create(data: CreateItemListInput, user: User) {
    const isOwner = await this.listsService.isUserOwnerOfList(
      user,
      data.listId,
    );
    if (!isOwner) {
      throw new NotFoundException('List not found');
    }
    const itemListExists = await this.doesItemListExist(data);
    if (itemListExists) {
      throw new InternalServerErrorException('Item already exists in the list');
    }
    try {
      const newList = this.itemListRepository.create(data);
      return await this.itemListRepository.save(newList);
    } catch {
      throw new InternalServerErrorException('Error creating itemList');
    }
  }

  findAll() {
    return `This action returns all itemLists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemList`;
  }

  update(id: number, updateItemListInput: UpdateItemListInput) {
    return `This action updates a #${id} itemList`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemList`;
  }

  async doesItemListExist(data: CreateItemListInput): Promise<boolean> {
    const { listId, itemId } = data;
    const itemList = await this.itemListRepository.findOneBy({
      listId,
      itemId,
    });
    return !!itemList;
  }
}
