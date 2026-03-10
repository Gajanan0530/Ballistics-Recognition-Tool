import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PredictionResult {
  label: string;
  confidence: number;
  threat: string;
  description: string;
  model: string;
  inference_time_ms: number;
}

interface ResultPanelProps {
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
}

export const ResultPanel = ({ result, loading, error }: ResultPanelProps) => {
  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 animate-pulse text-primary" />
            Processing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analyzing ballistic signature...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-destructive/10 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-muted-foreground">No Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Upload an image to begin analysis</p>
        </CardContent>
      </Card>
    );
  }

  const confidencePercent = (result.confidence * 100).toFixed(1);
  const threatColor = result.threat.toLowerCase() === "high" ? "destructive" : 
                       result.threat.toLowerCase() === "medium" ? "warning" : "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Classification Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Detected Missile</label>
            <p className="text-2xl font-bold text-foreground">{result.label}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Confidence</label>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-primary"
                />
              </div>
              <span className="text-lg font-semibold text-foreground">{confidencePercent}%</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Threat Level</label>
            <div className="mt-1">
              <Badge variant={threatColor as any} className="text-sm">
                {result.threat}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <p className="text-foreground mt-1">{result.description}</p>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
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
  );
};
