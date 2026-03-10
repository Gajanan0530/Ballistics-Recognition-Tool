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
