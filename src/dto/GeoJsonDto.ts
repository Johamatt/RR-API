export interface GeoJsonDto {
  type: string;
  features: Feature[];
}

interface Feature {
  type: string;
  geometry: Geometry;
  properties: Record<string, any>;
}

interface Geometry {
  type: string;
  coordinates: number[];
}
