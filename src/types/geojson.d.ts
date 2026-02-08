declare module "*.geojson" {
  const value: GeoJSON.FeatureCollection;
  export default value;
}

declare module "leaflet/dist/leaflet.css" {
  const content: string;
  export default content;
}
