import { Repository } from 'typeorm';

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationArgs } from 'src/common/dto';
import { paginate } from 'src/common/utils/pagination.util';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { User } from '../users/entities/user.entity';
import { CreateItemListInput, UpdateItemListInput } from './dto';
import { ItemList } from './entities/item-list.entity';

@Injectable()
export class ItemListsService {
  private readonly logger = new Logger('ItemListsService');

  constructor(
    @InjectRepository(ItemList)
    private itemListRepository: Repository<ItemList>,
    private readonly listsService: ListsService,
  ) {}

  async create(data: CreateItemListInput, user: User): Promise<ItemList> {
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
      await this.itemListRepository.save(newList);
      return await this.findOne(newList.id, user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating itemList');
    }
  }

  async update(data: UpdateItemListInput, user: User) {
    const itemList = await this.findOne(data.id, user);
    try {
      this.itemListRepository.merge(itemList, data);
      return await this.itemListRepository.save(itemList);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error updating itemList');
    }
  }

  findAllByList(
    list: List,
    paginationArgs: PaginationArgs,
  ): Promise<ItemList[]> {
    const { skip, take } = paginate(paginationArgs);
    return this.itemListRepository.find({
      where: { listId: list.id },
      relations: ['item', 'list'],
      skip,
      take,
    });
  }

  async findOne(id: string, user: User): Promise<ItemList> {
    const itemList = await this.itemListRepository.findOne({
      where: { id, list: { userId: user.id } },
      relations: ['item', 'list'],
    });
    if (!itemList) {
      throw new NotFoundException(`ItemList with ID ${id} not found`);
    }
    return itemList;
  }

  async remove(id: string, user: User): Promise<ItemList> {
    const itemList = await this.findOne(id, user);
    await this.itemListRepository.delete(itemList);
    return itemList;
  }

  async doesItemListExist(data: CreateItemListInput): Promise<boolean> {
    const { listId, itemId } = data;
    const itemList = await this.itemListRepository.findOneBy({
      listId,
      itemId,
    });
    return !!itemList;
  }

  async getListItemCount(list: List): Promise<number> {
    return this.itemListRepository.count({ where: { listId: list.id } });
  }
}
