import { Point, FeatureCollection } from 'geojson';

interface Properties {
  place_id: string;
  name_fi: string;
  katuosoite: string;
  liikuntapaikkatyyppi: string;
}

export type GeoJsonPointsResponse = FeatureCollection<Point, Properties>;
