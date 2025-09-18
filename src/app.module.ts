import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import envConfig from './envs/envs';
import { EnvsConfigModule } from './envs/envs.module';
import { validationSchema } from './envs/validations/envs.validation';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ItemsModule } from './modules/items/items.module';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),

    EnvsConfigModule,
    DatabaseModule,
    // !Forma síncrona
    //  GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   playground: false, // Deshabilitar playground en producción
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
    GraphqlModule,
    AuthModule,
    SeedModule,

    ItemsModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
