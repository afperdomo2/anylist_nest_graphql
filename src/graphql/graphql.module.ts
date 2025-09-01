import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { PayloadToken } from '../auth/interfaces/payload-token.interface';
import { GraphQLContextParams } from './interfaces/graphql-context-params.interface';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule], // Módulos a importar si los necesitas en useFactory
      inject: [JwtService], // Servicios a inyectar si los necesitas en useFactory
      useFactory: (jwtService: JwtService) => {
        const logger = new Logger('GraphQL');
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: false, // Deshabilitar playground en producción
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req }: GraphQLContextParams) => {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1];
            if (!token) {
              logger.error('No Bearer Token found');
              throw new Error('No Bearer Token found');
            }
            const payload: PayloadToken = jwtService.decode(token);
            if (!payload) {
              logger.error('Invalid JWT Token');
              throw new Error('Invalid JWT Token');
            }
          },
        };
      },
    }),
    AuthModule,
  ],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
