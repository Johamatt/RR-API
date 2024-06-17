import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Place } from '../places/places.entity';
import { AppModule } from '../app.module';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});

const main = async () => {
  try {
    console.time('main');
    await appDataSource.initialize();

    const app = await NestFactory.createApplicationContext(AppModule);
    const placeRepository = appDataSource.getRepository(Place);

    const data = fs.readFileSync('places.geojson', 'utf8');
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
