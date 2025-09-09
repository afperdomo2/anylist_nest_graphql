import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { Item } from './entities/item.entity';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

@Module({
  // !forwardRef:
  // Se usa forwardRef para evitar una dependica circular, UsersModule necesita
  // AuthModule y AuthModule necesita UsersModule. Solo se necesita usar forwardRef
  // en uno de los 2 módulos que tienen la dependencia circular.
  imports: [TypeOrmModule.forFeature([Item]), forwardRef(() => AuthModule)],
  providers: [ItemsResolver, ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
