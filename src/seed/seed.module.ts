import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvsConfigModule } from 'src/envs/envs.module';
import { ItemList } from 'src/modules/item-lists/entities/item-list.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemsModule } from 'src/modules/items/items.module';
import { List } from 'src/modules/lists/entities/list.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, User, List, ItemList]),
    EnvsConfigModule,
    UsersModule,
    ItemsModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
