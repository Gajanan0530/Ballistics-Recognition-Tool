import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload, BarChart3, Info, Target, TrendingUp, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    icon: Upload,
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
