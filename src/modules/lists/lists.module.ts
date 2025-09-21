import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { List } from './entities/list.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([List]), AuthModule],
  providers: [ListsResolver, ListsService],
})
export class ListsModule {}
