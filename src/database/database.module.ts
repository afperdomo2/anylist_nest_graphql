import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvsConfigService } from '../envs/envs.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvsConfigService],

      useFactory: (envsConfigService: EnvsConfigService) => {
        const dbConfig = envsConfigService.databaseConfig;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          autoLoadEntities: true,
          synchronize: true,
          softDelete: true,
          logging: false,
        };
      },
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
