import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isWithinInterval } from "date-fns";
import type { Transaction } from "@/types/financial";

interface MonthlySpendingChartProps {
  transactions: Transaction[];
}

type Period = "month" | "3months" | "year";

export function MonthlySpendingChart({ transactions }: MonthlySpendingChartProps) {
  const [period, setPeriod] = useState<Period>("month");

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    // Determine date range based on period
    switch (period) {
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "3months":
        startDate = startOfMonth(subMonths(now, 2));
        break;
      case "year":
        startDate = startOfMonth(subMonths(now, 11));
        break;
    }

    // Filter transactions for expenses only within period
    const periodTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        tx.type === "expense" &&
        isWithinInterval(txDate, { start: startDate, end: endDate })
      );
    });

    // Group by day for month view, by week for 3 months, by month for year
    const groupBy = period === "month" ? "day" : period === "3months" ? "week" : "month";

    if (groupBy === "day") {
      // Daily aggregation
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      return days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayTotal = periodTransactions
          .filter((tx) => format(new Date(tx.date), "yyyy-MM-dd") === dayStr)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        return {
          date: format(day, "MMM dd"),
          amount: dayTotal,
        };
      });
    } else if (groupBy === "week") {
      // Weekly aggregation (simplified: group by week number)
      const weekMap = new Map<string, number>();
      periodTransactions.forEach((tx) => {
        const txDate = new Date(tx.date);
        const weekKey = `Week ${Math.ceil(txDate.getDate() / 7)} ${format(txDate, "MMM")}`;
        weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + Math.abs(tx.amount));
      });

      return Array.from(weekMap.entries()).map(([date, amount]) => ({
        date,
        amount,
      }));
    } else {
      // Monthly aggregation
      const monthMap = new Map<string, number>();
      periodTransactions.forEach((tx) => {
        const monthKey = format(new Date(tx.date), "MMM yyyy");
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + Math.abs(tx.amount));
      });

      return Array.from(monthMap.entries()).map(([date, amount]) => ({
        date,
        amount,
      }));
    }
  }, [transactions, period]);

  const totalSpending = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.amount, 0);
  }, [chartData]);

  return (
    <Card className="border-previa-sand">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-previa-charcoal font-semibold">Monthly Spending</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-[140px] border-sand focus:ring-sand">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-stone">Total Spending</p>
          <p className="text-2xl font-mono font-bold text-charcoal">
            ${totalSpending.toFixed(2)}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#8C877D"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#8C877D"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F2E9D8",
                border: "1px solid #D9C8B4",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Spending"]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#595347"
              strokeWidth={2}
              dot={{ fill: "#595347", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

