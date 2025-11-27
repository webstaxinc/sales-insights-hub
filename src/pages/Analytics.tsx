import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CustomerHistogram from "@/components/CustomerHistogram";
import DataTable from "@/components/DataTable";

interface CustomerData {
  customerName: string;
  totalComputedPrice: number;
  recordCount: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("salesData");
    if (!storedData) {
      navigate("/");
      return;
    }

    const data = JSON.parse(storedData);
    setRawData(data);

    const customerMap = new Map<string, { total: number; count: number }>();
    
    data.forEach((row: any) => {
      const customerName = row["Customer Name"];
      const computedPrice = parseFloat(row["Computed Price"]) || 0;
      
      if (customerMap.has(customerName)) {
        const existing = customerMap.get(customerName)!;
        customerMap.set(customerName, {
          total: existing.total + computedPrice,
          count: existing.count + 1,
        });
      } else {
        customerMap.set(customerName, { total: computedPrice, count: 1 });
      }
    });

    const aggregatedData: CustomerData[] = Array.from(customerMap.entries())
      .map(([customerName, { total, count }]) => ({
        customerName,
        totalComputedPrice: total,
        recordCount: count,
      }))
      .sort((a, b) => b.totalComputedPrice - a.totalComputedPrice);

    setCustomerData(aggregatedData);
  }, [navigate]);

  const filteredData = selectedCustomer
    ? rawData.filter((row) => row["Customer Name"] === selectedCustomer)
    : rawData;

  const totalRevenue = customerData.reduce((sum, item) => sum + item.totalComputedPrice, 0);
  const totalCustomers = customerData.length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Sales Analytics</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl text-primary">
                ₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardDescription>Total Customers</CardDescription>
              <CardTitle className="text-3xl text-secondary">{totalCustomers}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardDescription>Total Records</CardDescription>
              <CardTitle className="text-3xl text-accent">{rawData.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Revenue by Customer
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedCustomer ? `Showing data for: ${selectedCustomer}` : "Click on a bar to view details"}
                </CardDescription>
              </div>
              {selectedCustomer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CustomerHistogram
              data={customerData}
              selectedCustomer={selectedCustomer}
              onBarClick={setSelectedCustomer}
            />
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>
              {selectedCustomer ? `Records for ${selectedCustomer}` : "All Sales Records"}
            </CardTitle>
            <CardDescription>
              Showing {filteredData.length} of {rawData.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
