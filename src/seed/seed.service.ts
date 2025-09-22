import { Repository } from 'typeorm';

import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnvsConfigService } from 'src/envs/envs.service';
import { ItemList } from 'src/modules/item-lists/entities/item-list.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemsService } from 'src/modules/items/items.service';
import { List } from 'src/modules/lists/entities/list.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly envsConfigService: EnvsConfigService,

    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
    @InjectRepository(ItemList)
    private readonly itemListRepository: Repository<ItemList>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  async executeSeed() {
    const isProd = this.envsConfigService.isProduction;
    if (isProd) {
      const msg = 'No se pueden ejecutar los Seeds en Producción';
      this.logger.warn(msg);
      throw new MethodNotAllowedException(msg);
    }

    await this.clearDatabase();
    const users = await this.insertUsers();
    const items = await this.insertItems(users);
    const lists = await this.insertLists(users);
    await this.insertItemLists(lists, items);

    this.logger.log('✅ Semilla de datos ejecutada con éxito');

    return true;
  }

  private async clearDatabase() {
    await this.itemListRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
    this.logger.log('✅ Base de datos limpia');
  }

  private async insertUsers() {
    this.logger.log('⏳ Insertando usuarios...');
    const userPromises = SEED_USERS.map((user) =>
      this.usersService.create(user),
    );
    const users = await Promise.all(userPromises);
    this.logger.log('✅ Usuarios insertados');
    return users;
  }

  private async insertItems(users: User[]) {
    this.logger.log('⏳ Insertando items...');
    const itemPromises = SEED_ITEMS.map((item) => {
      const randomUser = users.sort(() => Math.random() - 0.5)[0];
      return this.itemsService.create(
        { name: item.name, unitOfMeasurement: item.unitOfMeasurement },
        randomUser,
      );
    });
    const items = await Promise.all(itemPromises);
    await this.itemRepository.save(items);
    this.logger.log('✅ Items insertados');
    return items;
  }

  private async insertLists(users: User[]) {
    this.logger.log('⏳ Insertando listas...');
    const listPromises = SEED_LISTS.map((list) => {
      const randomUser = users.sort(() => Math.random() - 0.5)[0];
      return this.listRepository.create({ name: list.name, user: randomUser });
    });
    const lists = await Promise.all(listPromises);
    await this.listRepository.save(lists);
    this.logger.log('✅ Listas insertadas');
    return lists;
  }

  private async insertItemLists(lists: List[], items: Item[]) {
    this.logger.log('⏳ Insertando item-lists...');
    const itemCountPerList = [4, 10, 3, 2, 10];
    const itemListPromises = lists.map((list, index) => {
      const selectedItems = items
        .sort(() => Math.random() - 0.5)
        .slice(0, itemCountPerList[index]);
      const randomQuantity = Math.floor(Math.random() * 10) + 1;
      const randomIsCompleted = Math.random() < 0.5;
      return selectedItems.map((item) =>
        this.itemListRepository.create({
          list,
          item,
          quantity: randomQuantity,
          isCompleted: randomIsCompleted,
        }),
      );
    });
    const itemLists = (await Promise.all(itemListPromises)).flat();
    await this.itemListRepository.save(itemLists);
    this.logger.log('✅ Item-lists insertados');
  }
}
