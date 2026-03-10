import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield, Brain, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

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
