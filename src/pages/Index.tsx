
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import ProcessingArea from "@/components/ProcessingArea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processGeoJSON } from "@/utils/geoJsonProcessor";

const Index = () => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setFileName(file.name.replace(".geojson", ""));
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target && typeof event.target.result === "string") {
          const parsedData = JSON.parse(event.target.result);
          
          // Validate if it's a proper GeoJSON
          if (!parsedData.type || !parsedData.features) {
            throw new Error("Invalid GeoJSON format");
          }
          
          setGeoJsonData(parsedData);
          const processedData = processGeoJSON(parsedData);
          setCsvData(processedData);
          
          toast({
            title: "File processed successfully",
            description: `Found ${parsedData.features.length} features in the GeoJSON file.`,
          });
        }
      } catch (error) {
        console.error("Error parsing GeoJSON:", error);
        toast({
          title: "Error processing file",
          description: "The file is not a valid GeoJSON format.",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!csvData) return;
    
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName || "geoJSON-extract"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV downloaded",
      description: "Your CSV file has been successfully downloaded.",
    });
  };

  const resetApplication = () => {
    setGeoJsonData(null);
    setCsvData(null);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            GeoJSON to CSV Converter
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a GeoJSON file to extract latitude, longitude, and name information 
            for each feature and download as a CSV file.
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!geoJsonData ? (
            <FileUploader onFileUpload={handleFileUpload} />
          ) : (
            <ProcessingArea
              geoJsonData={geoJsonData}
              featureCount={geoJsonData.features.length}
              onReset={resetApplication}
            />
          )}

          {csvData && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleDownload} 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
              >
                <Download size={20} />
                Download CSV
              </Button>
            </div>
          )}
        </div>
        
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>Upload GeoJSON files to extract first coordinates and feature names.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
