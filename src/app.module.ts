import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import envConfig from './config/envs/envs.config';
import { validationSchema } from './config/envs/envs.validation';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ItemsModule } from './modules/items/items.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),

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

    ItemsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
