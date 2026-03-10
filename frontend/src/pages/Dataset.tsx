import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DatasetInfo } from "@/types/prediction";

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
