import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { List } from './entities/list.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([List]), forwardRef(() => AuthModule)],
  providers: [ListsResolver, ListsService],
  exports: [ListsService],
})
export class ListsModule {}
