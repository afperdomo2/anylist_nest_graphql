import { Repository } from 'typeorm';

import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnvsConfigService } from 'src/envs/envs.service';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemsService } from 'src/modules/items/items.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly envsConfigService: EnvsConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    await this.insertItems(users);

    this.logger.log('✅ Semilla de datos ejecutada');

    return true;
  }

  private async clearDatabase() {
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
}
