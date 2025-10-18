import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface SpendingChartProps {
  data: Array<{
    date: string;
    diningDollars: number;
    swipes: number;
    debit: number;
  }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card className="p-6" data-testid="card-spending-chart">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Spending Trends</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="diningDollars"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            name="Dining Dollars"
          />
          <Line
            type="monotone"
            dataKey="swipes"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="Meal Swipes"
          />
          <Line
            type="monotone"
            dataKey="debit"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            name="Debit Card"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
