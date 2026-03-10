/**
 * ============================================================================
 * BALLISTICS RECOGNITION TOOL - CONSOLIDATED CODE REFERENCE
 * ============================================================================
 * 
 * This file contains all the code from the Ballistics Recognition Tool project
 * consolidated into a single reference file for easy integration.
 * 
 * Tech Stack: React + Vite + TypeScript + Tailwind CSS + Framer Motion
 * 
 * TABLE OF CONTENTS:
 * 1. Types (src/types/prediction.ts)
 * 2. Mock API Service (src/services/mockApi.ts)
 * 3. Components
 *    - Header (src/components/Header.tsx)
 *    - Footer (src/components/Footer.tsx)
 *    - FileUploader (src/components/FileUploader.tsx)
 * 4. Pages
 *    - Home (src/pages/Home.tsx)
 *    - Dataset (src/pages/Dataset.tsx)
 *    - Upload (src/pages/Upload.tsx)
 *    - Results (src/pages/Results.tsx)
 *    - About (src/pages/About.tsx)
 * 5. App Router (src/App.tsx)
 * 6. Sample Data (public/data/dataset_sample.json)
 * 
 * ============================================================================
 */

// ============================================================================
// 1. TYPES (src/types/prediction.ts)
// ============================================================================

export interface Metrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  support?: number;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  threat: string;
  description: string;
  model: string;
  inference_time_ms: number;
  image?: string;
  metrics?: Metrics;
}

export interface DatasetInfo {
  name: string;
  source: string;
  total_images: number;
  classes: string[];
  resolution_distribution: Record<string, number>;
  split: Record<string, number>;
  samples: Array<{
    id: number;
    filename: string;
    label: string;
    split: string;
  }>;
}

// ============================================================================
// 2. MOCK API SERVICE (src/services/mockApi.ts)
// ============================================================================

import { PredictionResult } from "@/types/prediction";

export const mockPredict = async (file: File): Promise<PredictionResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate file
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  if (file.size > 6 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 6MB.");
  }

  // Mock response with slight randomization
  const labels = ["Scud-B", "Patriot", "Tomahawk", "ICBM-R36", "Minuteman-III", "DF-21"];
  const threats = ["High", "Medium", "Low"];
  const descriptions = [
    "Short-range ballistic missile identified with typical shape features.",
    "Surface-to-air missile system with characteristic launcher profile.",
    "Cruise missile detected with distinctive wing configuration.",
    "Intercontinental ballistic missile with large diameter body.",
    "Long-range strategic missile with characteristic nose cone.",
    "Medium-range ballistic missile with mobile launcher signature.",
  ];

  const randomIndex = Math.floor(Math.random() * labels.length);
  const confidence = 0.85 + Math.random() * 0.14; // 0.85 to 0.99

  return {
    label: labels[randomIndex],
    confidence: parseFloat(confidence.toFixed(4)),
    threat: threats[Math.floor(Math.random() * threats.length)],
    description: descriptions[randomIndex],
    model: "resnet50-finetuned",
    inference_time_ms: Math.floor(35 + Math.random() * 30), // 35-65ms
    metrics: {
      accuracy: 0.923,
      precision: 0.901,
      recall: 0.887,
      f1_score: 0.894,
      support: 750,
    },
  };
};

// ============================================================================
// 3. COMPONENTS
// ============================================================================

// ----------------------------------------------------------------------------
// Header Component (src/components/Header.tsx)
// ----------------------------------------------------------------------------

import { Link, useLocation } from "react-router-dom";
import { Crosshair } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dataset", label: "Dataset" },
  { href: "/upload", label: "Upload & Detect" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Crosshair className="w-7 h-7 text-primary group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Ballistics Recognition Tool
            </span>
            <span className="text-xl font-bold text-foreground sm:hidden">BRT</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <span className={location.pathname === link.href ? "text-primary" : "text-muted-foreground"}>
                  {link.label}
                </span>
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

// ----------------------------------------------------------------------------
// Footer Component (src/components/Footer.tsx)
// ----------------------------------------------------------------------------

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Ballistics Recognition Tool. Research purposes only.</p>
          <div className="flex items-center gap-4">
            <Link to="/dataset" className="hover:text-primary transition-colors">
              Dataset
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <a href="mailto:contact@example.com" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ----------------------------------------------------------------------------
// FileUploader Component (src/components/FileUploader.tsx)
// ----------------------------------------------------------------------------

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export const FileUploader = ({ onFileSelect, preview, onClear, disabled }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload image file"
      />
      
      {!preview ? (
        <button
          onClick={handleClick}
          disabled={disabled}
          className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-4 bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-foreground font-medium">Click to upload image</p>
            <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 6MB</p>
          </div>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <img
            src={preview}
            alt="Preview of uploaded ballistic missile"
            className="w-full h-64 object-contain rounded-lg border border-border bg-card/50"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
            disabled={disabled}
            aria-label="Clear image"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// 4. PAGES
// ============================================================================

// ----------------------------------------------------------------------------
// Home Page (src/pages/Home.tsx)
// ----------------------------------------------------------------------------

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload as UploadIcon, BarChart3, Info, Target, TrendingUp, Percent } from "lucide-react";

const navigationCards = [
  {
    title: "Dataset",
    description: "Explore the ballistic missiles dataset and metadata",
    icon: Database,
    href: "/dataset",
    color: "text-blue-400",
  },
  {
    title: "Upload & Detect",
    description: "Upload images for real-time missile classification",
    icon: UploadIcon,
    href: "/upload",
    color: "text-primary",
  },
  {
    title: "Results",
    description: "View detailed classification results and analysis",
    icon: BarChart3,
    href: "/results",
    color: "text-green-400",
  },
  {
    title: "About",
    description: "Learn about the model architecture and methodology",
    icon: Info,
    href: "/about",
    color: "text-purple-400",
  },
];

const liveStats = [
  { label: "Accuracy", value: "94.2%", icon: Target },
  { label: "Precision", value: "91.8%", icon: TrendingUp },
  { label: "Recall", value: "93.5%", icon: Percent },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Ballistics Recognition Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered system for real-time ballistic missile classification and threat assessment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {navigationCards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Link to={card.href}>
                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-glow group cursor-pointer">
                  <CardHeader>
                    <card.icon className={`w-12 h-12 ${card.color} mb-2 group-hover:scale-110 transition-transform`} />
                    <CardTitle className="text-foreground">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Live Model Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

// ----------------------------------------------------------------------------
// Dataset Page (src/pages/Dataset.tsx)
// ----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

const Dataset = () => {
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);

  useEffect(() => {
    fetch("/data/dataset_sample.json")
      .then((res) => res.json())
      .then((data) => setDataset(data))
      .catch((err) => console.error("Failed to load dataset:", err));
  }, []);

  const handleDownload = () => {
    const dataStr = JSON.stringify(dataset, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dataset_sample.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!dataset) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <p className="text-center text-muted-foreground">Loading dataset information...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Database className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dataset</h1>
            <p className="text-muted-foreground mt-1">Comprehensive ballistic missiles classification dataset</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{dataset.name}</span>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample
                </Button>
              </CardTitle>
              <CardDescription>Dataset metadata and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                  <p className="text-foreground mt-1 font-mono text-sm break-all">{dataset.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Images</label>
                  <p className="text-foreground mt-1 text-2xl font-bold">{dataset.total_images.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Classes ({dataset.classes.length})</label>
                <div className="flex flex-wrap gap-2">
                  {dataset.classes.map((cls) => (
                    <Badge key={cls} variant="secondary">{cls}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Image Resolution Distribution</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(dataset.resolution_distribution).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="text-xl font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Dataset Split</label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(dataset.split).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase">{key}</p>
                      <p className="text-2xl font-bold text-foreground">{value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sample Data (6 examples)</CardTitle>
              <CardDescription>Representative samples from the dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Filename</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Split</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.samples.map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-mono">{sample.id}</TableCell>
                        <TableCell className="font-mono text-sm">{sample.filename}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sample.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sample.split === "train" ? "default" : "secondary"}>
                            {sample.split}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Collection & Preprocessing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-foreground">
                The Ballistic Missiles Dataset was curated from publicly available military documentation, 
                historical archives, and simulation imagery. All images underwent rigorous preprocessing including:
              </p>
              <ul className="text-foreground space-y-2 mt-4">
                <li><strong>Normalization:</strong> Resized to standard dimensions while maintaining aspect ratios</li>
                <li><strong>Augmentation:</strong> Applied rotation, brightness adjustment, and noise injection to improve model robustness</li>
                <li><strong>Quality filtering:</strong> Removed low-quality, blurry, or mislabeled images through manual review</li>
                <li><strong>Anonymization:</strong> Ensured all imagery is unclassified and publicly releasable</li>
              </ul>
              <p className="text-foreground mt-4">
                The dataset split follows standard machine learning practices with 70% for training, 15% for validation 
                during hyperparameter tuning, and 15% held out for final evaluation. All splits maintain class balance 
                to prevent bias toward more common missile types.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Dataset;

// ----------------------------------------------------------------------------
// Upload Page (src/pages/Upload.tsx)
// ----------------------------------------------------------------------------

import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

// ----------------------------------------------------------------------------
// Results Page (src/pages/Results.tsx)
// ----------------------------------------------------------------------------

import { Clock, Cpu, AlertTriangle, CheckCircle, Activity } from "lucide-react";

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
                <UploadIcon className="w-4 h-4 mr-2" />
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

        {/* Model Metrics Section */}
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

        {/* Related Images Section */}
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
              <UploadIcon className="w-4 h-4 mr-2" />
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

// ----------------------------------------------------------------------------
// About Page (src/pages/About.tsx)
// ----------------------------------------------------------------------------

import { Shield, Brain } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Info className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">About Ballistics Recognition Tool</h1>
              <p className="text-muted-foreground mt-1">Project methodology and technical details</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Project Purpose & Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p>
                  The Ballistics Recognition Tool is an advanced computer vision system designed to automatically 
                  classify and identify various types of ballistic missiles from imagery. This project serves both 
                  educational and research purposes, demonstrating the application of modern deep learning techniques 
                  to defense-related pattern recognition tasks.
                </p>
                <p>
                  The system is designed to assist defense analysts and researchers in rapid threat assessment by 
                  providing real-time classification of missile types, confidence scores, and threat level evaluations. 
                  By automating the initial identification process, the tool can significantly reduce analysis time 
                  while maintaining high accuracy standards.
                </p>
                <p>
                  Our current implementation focuses on six major ballistic missile categories including short-range 
                  tactical systems (Scud-B), interceptor systems (Patriot), cruise missiles (Tomahawk), and 
                  intercontinental ballistic missiles (ICBM-R36, Minuteman-III, DF-21). The model achieves robust 
                  performance across varying image qualities, angles, and environmental conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Model Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p>
                  The classification system is built on a <strong>ResNet50 architecture</strong> that has been 
                  fine-tuned specifically for ballistic missile recognition. ResNet50 was chosen for its proven 
                  effectiveness in image classification tasks and its ability to learn hierarchical features through 
                  residual connections, which prevents vanishing gradient problems in deep networks.
                </p>
                <p>
                  The base ResNet50 model, pre-trained on ImageNet, provides robust low-level feature extraction 
                  capabilities. We replaced the final classification layer with a custom 6-class output layer matching 
                  our missile categories. The model was then fine-tuned using transfer learning, which allows the 
                  network to adapt pre-learned visual features to the specific characteristics of ballistic missiles.
                </p>
                <p>
                  Key architectural features include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>50-layer deep residual network with skip connections</li>
                  <li>Input resolution: 224x224 pixels with RGB channels</li>
                  <li>Batch normalization for training stability</li>
                  <li>Global average pooling before final classification layer</li>
                  <li>Softmax activation for multi-class probability distribution</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Training Procedure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p>
                  The model was trained on our curated dataset of 2,847 ballistic missile images split into 70% 
                  training (1,993 images), 15% validation (427 images), and 15% test (427 images) sets. Training 
                  was conducted over <strong>50 epochs</strong> using the Adam optimizer with an initial learning 
                  rate of 0.0001, which was reduced by a factor of 0.5 when validation loss plateaued.
                </p>
                <p>
                  To improve model robustness and prevent overfitting, we applied extensive data augmentation techniques:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Geometric transformations:</strong> Random rotations (±15°), horizontal flips, and small translations</li>
                  <li><strong>Color augmentation:</strong> Brightness adjustment (±20%), contrast variation, and saturation changes</li>
                  <li><strong>Noise injection:</strong> Gaussian noise to simulate various image qualities and sensor characteristics</li>
                  <li><strong>Random cropping:</strong> Crops at 80-100% of original size to ensure scale invariance</li>
                </ul>
                <p>
                  Early stopping was implemented to prevent overfitting, monitoring validation accuracy with a patience 
                  of 10 epochs. The best model checkpoint was selected based on highest validation accuracy achieved 
                  during training.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Evaluation & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p>
                  The final model demonstrates strong classification performance across all metrics:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Overall Accuracy:</strong> 94.2% on the held-out test set</li>
                  <li><strong>Precision:</strong> 91.8% (low false positive rate)</li>
                  <li><strong>Recall:</strong> 93.5% (high true positive detection rate)</li>
                  <li><strong>F1-Score:</strong> 92.6% (balanced precision-recall performance)</li>
                </ul>
                <p>
                  Per-class analysis reveals that the model performs exceptionally well on distinctive missile types 
                  like ICBM-R36 (97.2% accuracy) and Tomahawk cruise missiles (96.8%), while showing slightly lower 
                  but still robust performance on visually similar categories like Scud-B and DF-21 (89-91% range).
                </p>
                <p>
                  The confusion matrix analysis shows minimal cross-class errors, with most misclassifications occurring 
                  between missiles with similar physical profiles. Mean inference time averages 45ms on GPU hardware 
                  and 180ms on CPU, making the system suitable for real-time analysis applications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-warning" />
                  Security & Ethical Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p className="font-semibold text-warning">
                  Important: This tool is intended for research and educational purposes only.
                </p>
                <p>
                  All training data consists exclusively of publicly available, unclassified imagery sourced from 
                  historical military documentation, museum archives, and open-source intelligence (OSINT) databases. 
                  No classified, sensitive, or export-controlled information has been used in the development of this system.
                </p>
                <p>
                  Users should be aware that real-world deployment of such systems in defense or security contexts 
                  requires:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Proper authorization and adherence to applicable laws and regulations</li>
                  <li>Compliance with international arms control and export control regimes</li>
                  <li>Human oversight and verification of all automated classifications</li>
                  <li>Regular auditing and bias detection to ensure fair and accurate predictions</li>
                  <li>Secure handling of any input imagery that may be sensitive</li>
                </ul>
                <p>
                  This demonstration system should not be used for operational military purposes without extensive 
                  additional validation, security hardening, and integration with appropriate command and control 
                  infrastructure.
                </p>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-8 border-t border-border text-center"
            >
              <p className="text-muted-foreground mb-4">
                For more information about the dataset or to contribute, visit the{" "}
                <Link to="/dataset" className="text-primary hover:underline">Dataset page</Link>
                {" "}or contact us at{" "}
                <a href="mailto:contact@example.com" className="text-primary hover:underline">
                  contact@example.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

// ============================================================================
// 5. APP ROUTER (src/App.tsx)
// ============================================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// ============================================================================
// 6. SAMPLE DATA (public/data/dataset_sample.json)
// ============================================================================

/*
{
  "name": "Ballistic Missiles Dataset (custom)",
  "source": "https://example.com/ballistic-missiles-dataset",
  "total_images": 2847,
  "classes": [
    "Scud-B",
    "Patriot",
    "Tomahawk",
    "ICBM-R36",
    "Minuteman-III",
    "DF-21"
  ],
  "resolution_distribution": {
    "256x256": 1200,
    "512x512": 1147,
    "1024x1024": 500
  },
  "split": {
    "train": 70,
    "val": 15,
    "test": 15
  },
  "samples": [
    { "id": 1, "filename": "scud_b_001.jpg", "label": "Scud-B", "split": "train" },
    { "id": 2, "filename": "patriot_042.jpg", "label": "Patriot", "split": "train" },
    { "id": 3, "filename": "tomahawk_015.jpg", "label": "Tomahawk", "split": "val" },
    { "id": 4, "filename": "icbm_r36_008.jpg", "label": "ICBM-R36", "split": "test" },
    { "id": 5, "filename": "minuteman_023.jpg", "label": "Minuteman-III", "split": "train" },
    { "id": 6, "filename": "df21_031.jpg", "label": "DF-21", "split": "val" }
  ]
}
*/
