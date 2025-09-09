import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnvsConfigService } from 'src/envs/envs.service';
import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly envsConfigService: EnvsConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    const isProd = this.envsConfigService.isProduction;
    if (isProd) {
      const msg = 'No se pueden ejecutar los Seeds en Producción';
      this.logger.warn(msg);
      throw new MethodNotAllowedException(msg);
    }

    await this.clearDatabase();

    return true;
  }

  private async clearDatabase() {
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
    this.logger.log('✅ Base de datos limpia');
  }
}
