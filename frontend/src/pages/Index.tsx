import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ResultPanel } from "@/components/ResultPanel";
import { MetricsDashboard } from "@/components/MetricsDashboard";
import { Button } from "@/components/ui/button";
import { Crosshair, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PredictionResult {
  label: string;
  confidence: number;
  threat: string;
  description: string;
  model: string;
  inference_time_ms: number;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const mockResult: PredictionResult = {
        label: "Scud-B",
        confidence: 0.9123,
        threat: "High",
        description: "Short-range ballistic missile identified with typical shape features.",
        model: "resnet50-finetuned",
        inference_time_ms: 45,
      };

      setResult(mockResult);
      toast({
        title: "Analysis complete",
        description: `Detected: ${mockResult.label} (${(mockResult.confidence * 100).toFixed(1)}% confidence)`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze image";
      setError(errorMessage);
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Crosshair className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ballistics Recognition Tool</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced AI-powered missile classification system
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-foreground">Upload Image</h2>
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
                {loading ? "Analyzing..." : "Predict"}
              </Button>
              <Button
                onClick={handleClear}
                disabled={!file || loading}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Analysis Results</h2>
            <ResultPanel result={result} loading={loading} error={error} />
          </motion.div>
        </section>

        <MetricsDashboard />
      </main>
    </div>
  );
};

export default Index;
