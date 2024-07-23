import { Feature, Point } from 'geojson';

interface Properties {
  placeId: string;
  nameFi: string;
  katuosoite: string;
  liikuntapaikkaTyyppi: string;
}

export type GeoJsonPointsRequest = Feature<Point, Properties>[];
