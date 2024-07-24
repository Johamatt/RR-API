import { Feature, Point } from 'geojson';

interface Properties {
  place_id: string;
  name_fi: string;
  katuosoite: string;
  liikuntapaikkatyyppi: string;
}

export type GeoJsonPointsRequest = Feature<Point, Properties>[];
