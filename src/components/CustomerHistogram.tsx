import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

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

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--foreground))" }}
            label={{
              value: "Computed Price (₹)",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--foreground))",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "value") {
                return [
                  <>
                    <div className="font-semibold">{props.payload.fullName}</div>
                    <div>Revenue: ₹{value.toLocaleString("en-IN")}</div>
                    <div>Records: {props.payload.count}</div>
                  </>,
                  "",
                ];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={() => "Customer Revenue"}
          />
          <Bar
            dataKey="value"
            name="Computed Price"
            onClick={(data) => onBarClick(data.fullName)}
            cursor="pointer"
            radius={[8, 8, 0, 0]}
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
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerHistogram;
