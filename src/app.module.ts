import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import envConfig from './config/envs/envs.config';
import { validationSchema } from './config/envs/envs.validation';
import { DatabaseModule } from './database/database.module';
import { ItemsModule } from './modules/items/items.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false, // Deshabilitar playground en producción
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ItemsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
