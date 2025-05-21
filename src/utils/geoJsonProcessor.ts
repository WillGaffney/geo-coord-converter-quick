
/**
 * Process GeoJSON data and convert it to CSV format
 * Format: latitude,longitude,name (no header row)
 */
export function processGeoJSON(geoJsonData: any): string {
  if (!geoJsonData || !geoJsonData.features || !Array.isArray(geoJsonData.features)) {
    throw new Error("Invalid GeoJSON data format");
  }

  const csvRows: string[] = [];

  // Process each feature in the GeoJSON
  geoJsonData.features.forEach((feature: any) => {
    try {
      // Get the feature name from properties
      const name = feature.properties && feature.properties.name 
        ? feature.properties.name.replace(/,/g, ' ') // Replace commas in names to avoid CSV issues
        : "Unnamed Feature";

      // Get the first coordinate
      let coords: [number, number] | null = null;

      if (feature.geometry && feature.geometry.coordinates) {
        if (feature.geometry.type === "Point") {
          coords = feature.geometry.coordinates;
        } else if (feature.geometry.type === "LineString" || feature.geometry.type === "MultiPoint") {
          coords = feature.geometry.coordinates[0];
        } else if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiLineString") {
          coords = feature.geometry.coordinates[0][0];
        } else if (feature.geometry.type === "MultiPolygon") {
          coords = feature.geometry.coordinates[0][0][0];
        }
      }

      if (coords) {
        // GeoJSON uses [longitude, latitude], but we want [latitude, longitude] for the output
        const [longitude, latitude] = coords;
        
        // Create CSV row: latitude,longitude,name
        csvRows.push(`${latitude},${longitude},${name}`);
      }
    } catch (error) {
      console.error("Error processing feature:", error);
      // Continue with the next feature
    }
  });

  // Join all rows with newlines
  return csvRows.join('\n');
}
