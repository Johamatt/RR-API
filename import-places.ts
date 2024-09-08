import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Place } from './src/places/places.entity';
import { AppModule } from './src/app.module';
import { CreatePlaceDto } from './src/common/dto/PlaceDto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { AddressDto } from './src/common/dto/AddressDto';
import { Address } from './src/address/address.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({ path: '../../.env' });

const skipCategory = [
  'Erämaa-alue',
  'Alamäkiluistelurata',
  'Huoltorakennukset',
  'Jääspeedway',
  'Kansallispuisto',
  'Kilpajäähalli',
  'Kylpylä',
  'Laavu, kota tai kammi',
  'Luontotorni',
  'Luontopolku',
  'Lähipuisto',
  'Monikäyttöalue, jolla on virkistyspalveluita',
  'Muu luonnonsuojelualue, jolla on virkistyspalveluita',
  'Opastuspiste',
  'Rantautumispaikka',
  'Ravirata',
  'Retkeilyreitti',
  'Ruoanlaittopaikka',
  'Salibandyhalli',
  'Soutustadion',
  'Soudun ja melonnan sisäharjoittelutila',
  'Telttailu ja leiriytyminen',
  'Tupa',
  'Ulkoilualue',
  'Ulkoilumaja/hiihtomaja',
  'Ulkoilupuisto',
  'Urheiluilmailualue',
  'Valtion retkeilualue',
  'Veneilyn palvelupaikka',
  'Virkistysmetsä',
];

const databaseHost = process.env.DATABASE_HOST;
const databasePort = Number(process.env.DATABASE_PORT);
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

console.log('Database Host:', databaseHost);
console.log('Database Port:', databasePort);
console.log('Database User:', databaseUser);
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
  namingStrategy: new SnakeNamingStrategy(),
});

const main = async () => {
  try {
    console.time('main');
    let insertedCount = 0;

    await appDataSource.initialize();

    const app = await NestFactory.createApplicationContext(AppModule);
    const placeRepository = appDataSource.getRepository(Place);
    const addressRepository = appDataSource.getRepository(Address);

    const geojsonFilePath = path.resolve(__dirname, '/app/places.geojson');

    console.log(geojsonFilePath);

    const data = fs.readFileSync(geojsonFilePath, 'utf8');
    const geojson = JSON.parse(data);

    const features = geojson.Features;

    for (const feature of features) {
      const { geometry, properties } = feature;
      const { type, coordinates } = geometry;
      const nimiSuomeksi = properties['Nimi suomeksi'];

      if (
        nimiSuomeksi &&
        ((nimiSuomeksi.includes('lukio') && nimiSuomeksi.includes('sali')) ||
          (nimiSuomeksi.includes('koulu') && nimiSuomeksi.includes('sali')))
      ) {
        continue;
      }
      if (skipCategory.includes(properties['Liikuntapaikkatyyppi'])) {
        continue;
      }

      const addressDto: AddressDto = {
        katuosoite: properties['Katuosoite'],
        kunta: properties['Kunta'],
        kuntaosa: properties['Kuntaosa'],
        postitoimipaikka: properties['Postitoimipaikka'],
        postinumero: properties['Postinumero'],
        maakunta: properties['Maakunta'],
      };

      const address = plainToClass(Address, addressDto);

      const addressErrors = await validate(address);
      if (addressErrors.length > 0) {
        console.error('Address validation errors:', addressErrors);
        continue;
      }

      let createPlaceDto: CreatePlaceDto = {
        address: addressDto,
        place_id: properties['Lipas-id'].toString(),
        name_fi: properties['Nimi suomeksi'],
        liikuntapaikkatyyppi: properties['Liikuntapaikkatyyppi'],
        liikuntapaikkatyypinalaryhmä:
          properties['Liikuntapaikkatyypin alaryhmä'],
        liikuntapaikkatyypinpääryhmä:
          properties['Liikuntapaikkatyypin pääryhmä'],
        www: properties['WWW'],
        lisätieto: properties['Lisätieto'],
        muokattu_viimeksi: properties['Muokattu viimeksi'],
        puhelinnumero: properties['Puhelinnumero'],
        markkinointinimi: properties['Markkinointinimi'],
        sähköposti: properties['Sähköposti'],
        point_coordinates: null,
        polygon_coordinates: null,
        linestring_coordinates: null,
      };

      if (type === 'Point') {
        createPlaceDto.point_coordinates = {
          type: 'Point',
          coordinates: coordinates,
        };
      } else if (type === 'Polygon') {
        createPlaceDto.polygon_coordinates = {
          type: 'Polygon',
          coordinates: coordinates,
        };
      } else if (type === 'LineString') {
        let simplifiedCoordinates = coordinates.map((coord) =>
          coord.slice(0, 2),
        );

        createPlaceDto.linestring_coordinates = {
          type: 'LineString',
          coordinates: simplifiedCoordinates,
        };
      } else {
        console.warn(`Unsupported geometry type: ${type}`);
        continue;
      }

      const errors = await validate(
        plainToClass(CreatePlaceDto, createPlaceDto),
      );

      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        process.exit(1);
      }
      const place = plainToClass(Place, createPlaceDto);

      try {
        const existingPlace = await placeRepository.findOne({
          where: { place_id: place.place_id },
          relations: ['address'],
        });

        if (existingPlace) {
          const updateFields: Partial<Place> = {};

          if (!existingPlace.point_coordinates && place.point_coordinates) {
            updateFields.point_coordinates = place.point_coordinates;
          }
          if (!existingPlace.polygon_coordinates && place.polygon_coordinates) {
            updateFields.polygon_coordinates = place.polygon_coordinates;
          }
          if (
            !existingPlace.linestring_coordinates &&
            place.linestring_coordinates
          ) {
            updateFields.linestring_coordinates = place.linestring_coordinates;
          }

          if (Object.keys(updateFields).length > 0) {
            await placeRepository.update(
              { place_id: place.place_id },
              updateFields,
            );
          }
        } else {
          await addressRepository.save(address);
          place.address = address;
          await placeRepository.save(place);

          insertedCount++;
          if (insertedCount % 1000 === 0) {
            console.log(`${insertedCount} places inserted...`);
          }
        }
      } catch (err) {
        console.error('Error saving place:', err);
        process.exit(1);
      }
    }

    console.timeEnd('main');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

main();
