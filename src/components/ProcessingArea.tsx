
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProcessingAreaProps {
  geoJsonData: any;
  featureCount: number;
  onReset: () => void;
}

const ProcessingArea = ({ geoJsonData, featureCount, onReset }: ProcessingAreaProps) => {
  // Show a sample of the first 3 features if available
  const sampleFeatures = geoJsonData.features.slice(0, 3);

  const getFeatureInfo = (feature: any) => {
    const name = feature.properties.name || "Unnamed Feature";
    let coordinateInfo = "No coordinates";
    
    if (feature.geometry && feature.geometry.coordinates) {
      // Get the first coordinate pair
      let coords;
      
      if (feature.geometry.type === "Point") {
        coords = feature.geometry.coordinates;
      } else if (feature.geometry.type === "LineString" || feature.geometry.type === "MultiPoint") {
        coords = feature.geometry.coordinates[0];
      } else if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiLineString") {
        coords = feature.geometry.coordinates[0][0];
      } else if (feature.geometry.type === "MultiPolygon") {
        coords = feature.geometry.coordinates[0][0][0];
      }
      
      if (coords) {
        // GeoJSON format is [longitude, latitude]
        const [longitude, latitude] = coords;
        coordinateInfo = `[${latitude.toFixed(6)}, ${longitude.toFixed(6)}]`;
      }
    }
    
    return { name, coordinateInfo };
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-between">
        <div>
          <h3 className="text-green-800 font-medium">GeoJSON Successfully Processed</h3>
          <p className="text-green-600 text-sm">
            Found {featureCount} features in the uploaded file. Ready to download as CSV.
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>
          Upload Another File
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-700 font-medium">Sample Preview</h3>
        <div className="grid gap-3">
          {sampleFeatures.map((feature: any, index: number) => {
            const { name, coordinateInfo } = getFeatureInfo(feature);
            return (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{name}</p>
                      <p className="text-xs text-gray-500">First Coordinate (lat, lng): {coordinateInfo}</p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Feature {index + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {featureCount > 3 && (
            <p className="text-xs text-gray-500 text-center">
              And {featureCount - 3} more features...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingArea;
