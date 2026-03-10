import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Percent } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Accuracy", value: "94.2%", icon: Target, color: "text-success" },
  { label: "Precision", value: "91.8%", icon: TrendingUp, color: "text-primary" },
  { label: "Recall", value: "93.5%", icon: Percent, color: "text-warning" },
];

export const MetricsDashboard = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Model Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
