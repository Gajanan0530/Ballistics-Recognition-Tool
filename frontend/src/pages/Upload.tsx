import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { mockPredict } from "@/services/mockApi";
import { PredictionResult } from "@/types/prediction";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 6 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 6MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  const handlePredict = async () => {
    if (!file || !preview) return;

    setLoading(true);

    try {
      const result = await mockPredict(file);
      
      // Store result with image in sessionStorage
      const resultWithImage: PredictionResult = {
        ...result,
        image: preview,
      };
      sessionStorage.setItem("predictionResult", JSON.stringify(resultWithImage));

      toast({
        title: "Analysis complete",
        description: `Detected: ${result.label} (${(result.confidence * 100).toFixed(1)}% confidence)`,
      });

      // Navigate to results page
      navigate("/results");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze image";
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <UploadIcon className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Upload & Detect</h1>
              <p className="text-muted-foreground mt-1">Upload an image for ballistic missile classification</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>
                Select a PNG or JPG image (max 6MB) containing a ballistic missile for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader
                onFileSelect={handleFileSelect}
                preview={preview}
                onClear={handleClear}
                disabled={loading}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handlePredict}
                  disabled={!file || loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-pulse">Analyzing...</span>
                    </>
                  ) : (
                    "Predict"
                  )}
                </Button>
                <Button
                  onClick={handleClear}
                  disabled={!file || loading}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </motion.div>
              )}
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. Upload a clear image of a ballistic missile</p>
                <p>2. Click "Predict" to run the classification model</p>
                <p>3. View detailed results including confidence, threat level, and description</p>
                <p>4. Results are automatically saved for review on the Results page</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
