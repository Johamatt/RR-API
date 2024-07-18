import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Place } from '../places/places.entity';
import { AppModule } from '../app.module';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: '../../.env' });

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
});

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

const main = async () => {
  try {
    console.time('main');
    await appDataSource.initialize();

    const app = await NestFactory.createApplicationContext(AppModule);
    const placeRepository = appDataSource.getRepository(Place);

    const geojsonFilePath = path.resolve(__dirname, '../../places4.geojson');
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

      let createPlaceDto: CreatePlaceDto = {
        placeId: properties['Lipas-id'],
        nameFi: properties['Nimi suomeksi'],
        liikuntapaikkaTyyppi: properties['Liikuntapaikkatyyppi'],
        liikuntapaikkatyypinAlaryhmä:
          properties['Liikuntapaikkatyypin alaryhmä'],
        liikuntapaikkatyypinPääryhmä:
          properties['Liikuntapaikkatyypin pääryhmä'],
        www: properties['WWW'],
        country: 'FI',
        katuosoite: properties['Katuosoite'],
        kunta: properties['Kunta'],
        kuntaosa: properties['Kuntaosa'],
        liikuntapintaalaM2: properties['Liikuntapinta-ala m2'],
        postitoimipaikka: properties['Postitoimipaikka'],
        lisätieto: properties['Lisätieto'],
        muokattuViimeksi: properties['Muokattu viimeksi'],
        kentänLeveysM: properties['Kentän leveys m'],
        postinumero: properties['Postinumero'],
        kentänPituusM: properties['Kentän pituus m'],
        puhelinnumero: properties['Puhelinnumero'],
        pintamateriaaliLisätieto: properties['Pintamateriaali lisätieto'],
        markkinointinimi: properties['Markkinointinimi'],
        omistaja: properties['Omistaja'],
        maakunta: properties['Maakunta'],
        pintamateriaali: properties['Pintamateriaali'],
        sähköposti: properties['Sähköposti'],
        peruskorjausvuodet: properties['Peruskorjausvuodet'],
        aviAlue: properties['AVI-alue'],
        pointCoordinates: null,
        polygonCoordinates: null,
        linestringCoordinates: null,
      };

      if (type === 'Point') {
        createPlaceDto.pointCoordinates = {
          type: 'Point',
          coordinates: coordinates,
        };
      } else if (type === 'Polygon') {
        createPlaceDto.polygonCoordinates = {
          type: 'Polygon',
          coordinates: coordinates,
        };
      } else if (type === 'LineString') {
        let simplifiedCoordinates = coordinates.map((coord) => {
          // Filter out the Z dimension
          return coord.slice(0, 2);
        });

        createPlaceDto.linestringCoordinates = {
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
        continue;
      }
      const place = plainToClass(Place, createPlaceDto);

      // TODO this overdrives other coordinates
      try {
        const existingPlace = await placeRepository.findOneBy({
          placeId: place.placeId,
        });
        if (existingPlace) {
          await placeRepository.update({ placeId: place.placeId }, place);
        } else {
          await placeRepository.save(place);
        }
      } catch (err) {
        console.error('Error saving place:', err);
        continue;
      }

      console.log(createPlaceDto);
    }

    console.timeEnd('main');
  } catch (err) {
    console.error('Error:', err);
  }
};

main();
