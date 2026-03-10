import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload, Clock, Cpu, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PredictionResult, Metrics } from "@/types/prediction";

const formatMetric = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) return "–";
  return `${(value * 100).toFixed(1)}%`;
};

const formatSupport = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) return "–";
  return value.toLocaleString();
};

const Results = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse result:", err);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <BarChart3 className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Results Available</h2>
            <p className="text-muted-foreground mb-6">Upload an image first to see classification results</p>
            <Button asChild size="lg">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Link>
            </Button>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  const confidencePercent = (result.confidence * 100).toFixed(1);
  const threatColor = result.threat.toLowerCase() === "high" ? "destructive" : 
                       result.threat.toLowerCase() === "medium" ? "warning" : "success";

  const relatedImages = [
    { id: 1, label: result.label },
    { id: 2, label: result.label },
    { id: 3, label: result.label },
    { id: 4, label: result.label },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <BarChart3 className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Classification Results</h1>
            <p className="text-muted-foreground mt-1">Detailed analysis and predictions</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Image</CardTitle>
                <CardDescription>Original image submitted for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {result.image && (
                  <img
                    src={result.image}
                    alt="Uploaded ballistic missile"
                    className="w-full h-80 object-contain rounded-lg border border-border bg-card/50"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Classification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground">Detected Missile</label>
                  <p className="text-3xl font-bold text-foreground mt-1">{result.label}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Confidence</label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidencePercent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <span className="text-xl font-semibold text-foreground min-w-[4rem] text-right">
                      {confidencePercent}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Threat Level</label>
                  <div className="mt-1">
                    <Badge variant={threatColor as any} className="text-base px-4 py-1">
                      {result.threat.toLowerCase() === "high" && <AlertTriangle className="w-4 h-4 mr-2" />}
                      {result.threat}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="text-foreground mt-1 leading-relaxed">{result.description}</p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Model
                    </span>
                    <span className="text-foreground font-mono">{result.model}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Inference Time
                    </span>
                    <span className="text-foreground">{result.inference_time_ms}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Model Metrics
              </CardTitle>
              <CardDescription>Overall model performance on test set</CardDescription>
            </CardHeader>
            <CardContent>
              {result.metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-bold text-foreground">{formatMetric(result.metrics.accuracy)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Precision</p>
                    <p className="text-2xl font-bold text-foreground">{formatMetric(result.metrics.precision)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Recall</p>
                    <p className="text-2xl font-bold text-foreground">{formatMetric(result.metrics.recall)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-1">F1-Score</p>
                    <p className="text-2xl font-bold text-foreground">{formatMetric(result.metrics.f1_score)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Support</p>
                    <p className="text-2xl font-bold text-foreground">{formatSupport(result.metrics.support)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Metrics not available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Related Dataset Images</CardTitle>
              <CardDescription>Other examples of {result.label} from the training dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedImages.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border"
                  >
                    <div className="text-center p-4">
                      <p className="text-sm text-muted-foreground">Sample {img.id}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{img.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button asChild size="lg">
            <Link to="/upload">
              <Upload className="w-4 h-4 mr-2" />
              Analyze Another Image
            </Link>
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
