import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VisitsModule } from './visits/visits.module';
import { User } from './users/users.entity';
import { Place } from './places/places.entity';
import { Visit } from './visits/visits.entity';
import { PlacesModule } from './places/places.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Place, Visit],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    PlacesModule,
    VisitsModule,
    AuthModule,
  ],
})
export class AppModule {}
