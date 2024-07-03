import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Place } from '../places/places.entity';
import { AppModule } from '../app.module';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '../../.env' });

const databaseHost = process.env.DATABASE_HOST;
const databasePort = Number(process.env.DATABASE_PORT);
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

console.log('Database Host:', databaseHost);
console.log('Database Port:', databasePort);
console.log('Database User:', databaseUser);
console.log('Database Password:', databasePassword);
console.log('Database Name:', databaseName);

const appDataSource = new DataSource({
  type: 'postgres',
  host: databaseHost,
  port: databasePort,
  username: databaseUser,
  password: databasePassword,
  database: databaseName,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
const main = async () => {
  try {
    console.time('main');
    await appDataSource.initialize();

    const app = await NestFactory.createApplicationContext(AppModule);
    const placeRepository = appDataSource.getRepository(Place);

    const geojsonFilePath = path.resolve(__dirname, '../../places.geojson');
    const data = fs.readFileSync(geojsonFilePath, 'utf8');
    const geojson = JSON.parse(data);

    for (const feature of geojson.features) {
      const { name, description } = feature.properties;
      const [longitude, latitude] = feature.geometry.coordinates;
      const place_id = feature.properties['@id'];
      const strippedId = place_id.replace('node/', '');
      if (place_id && name && latitude && longitude) {
        const createPlaceDto: CreatePlaceDto = {
          place_id: strippedId,
          name,
          description: description || '',
          coordinates: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          points: 0,
          country: 'Norway',
        };

        const errors = await validate(
          plainToClass(CreatePlaceDto, createPlaceDto),
        );
        if (errors.length > 0) {
          console.error('Validation errors:', errors);
          continue;
        }
        const place = plainToClass(Place, createPlaceDto);

        await placeRepository.save(place);
      }
    }

    await app.close();
    console.timeEnd('main');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
