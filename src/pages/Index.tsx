import { useNavigate } from "react-router-dom";
import { BarChart3, Upload, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary rounded-lg p-2">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sales Analytics Platform</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
              Transform Your Sales Data
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload, analyze, and visualize your sales performance with powerful interactive charts and detailed insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy Upload</CardTitle>
                <CardDescription>
                  Simply drag and drop your Excel files for instant processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Automatic computation of metrics and intelligent data processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Visual Insights</CardTitle>
                <CardDescription>
                  Interactive charts with drill-down capabilities for deeper analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="shadow-elegant bg-gradient-primary text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Ready to get started?</h3>
                  <p className="text-white/90">
                    Upload your first Excel file and discover powerful insights in seconds
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate("/upload")}
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Start Analyzing
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card rounded-lg border border-border p-6 shadow-elegant">
            <h3 className="font-semibold text-foreground mb-4">Key Features:</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Support for 96-column Excel format
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Automatic price computations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Customer-wise revenue analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Interactive filtering and sorting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Detailed drill-down tables
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Export-ready analytics
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
