import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from '../items/items.module';
import { List } from '../lists/entities/list.entity';
import { ListsModule } from '../lists/lists.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  // !forwardRef:
  // Se usa forwardRef para evitar una dependica circular, UsersModule necesita
  // AuthModule y AuthModule necesita UsersModule. Solo se necesita usar forwardRef
  // en uno de los 2 módulos que tienen la dependencia circular.
  imports: [
    TypeOrmModule.forFeature([User, List]),
    forwardRef(() => AuthModule),
    ItemsModule,
    ListsModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
