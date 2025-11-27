import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface CustomerData {
  customerName: string;
  totalComputedPrice: number;
  recordCount: number;
}

interface Props {
  data: CustomerData[];
  selectedCustomer: string | null;
  onBarClick: (customerName: string) => void;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

const CustomerHistogram = ({ data, selectedCustomer, onBarClick }: Props) => {
  const chartData = data.map((item) => ({
    name: item.customerName.length > 20 
      ? item.customerName.substring(0, 20) + "..." 
      : item.customerName,
    fullName: item.customerName,
    value: item.totalComputedPrice,
    count: item.recordCount,
  }));

  // Calculate dynamic domain for better scaling
  const values = chartData.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  
  // Use logarithmic scaling if there's a large variance
  const variance = maxValue / (minValue || 1);
  const useLogScale = variance > 100;
  
  // For log scale, ensure minimum value is visible
  const yAxisDomain = useLogScale 
    ? [Math.max(1, minValue * 0.5), maxValue * 1.1] 
    : [0, maxValue * 1.1];

  const formatYAxis = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="w-full h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 50, left: 80, bottom: 120 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
          />
          <YAxis
            scale={useLogScale ? "log" : "linear"}
            domain={yAxisDomain}
            tickFormatter={formatYAxis}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
            width={70}
            label={{
              value: "Computed Price",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--foreground))",
              style: { textAnchor: "middle" }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--foreground))",
              padding: "12px",
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "value") {
                return [
                  <>
                    <div className="font-semibold mb-1">{props.payload.fullName}</div>
                    <div className="text-primary font-medium">Revenue: ₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                    <div className="text-muted-foreground text-sm">Records: {props.payload.count}</div>
                  </>,
                  "",
                ];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={() => useLogScale ? "Customer Revenue (Log Scale)" : "Customer Revenue"}
          />
          <Bar
            dataKey="value"
            name="value"
            onClick={(data) => onBarClick(data.fullName)}
            cursor="pointer"
            radius={[6, 6, 0, 0]}
            minPointSize={5}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  selectedCustomer === entry.fullName
                    ? "hsl(var(--accent))"
                    : COLORS[index % COLORS.length]
                }
                opacity={selectedCustomer && selectedCustomer !== entry.fullName ? 0.3 : 1}
                strokeWidth={selectedCustomer === entry.fullName ? 2 : 0}
                stroke="hsl(var(--accent-foreground))"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerHistogram;
