import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsModule } from '../lists/lists.module';
import { ItemList } from './entities/item-list.entity';
import { ItemListsResolver } from './item-lists.resolver';
import { ItemListsService } from './item-lists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemList]),
    forwardRef(() => ListsModule),
  ],
  providers: [ItemListsResolver, ItemListsService],
  exports: [ItemListsService],
})
export class ItemListsModule {}
