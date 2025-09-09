import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvsConfigModule } from 'src/envs/envs.module';
import { Item } from 'src/modules/items/entities/item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  imports: [EnvsConfigModule, TypeOrmModule.forFeature([Item, User])],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
