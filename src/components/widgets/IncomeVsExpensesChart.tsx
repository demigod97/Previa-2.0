import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import type { Transaction } from "@/types/financial";

interface IncomeVsExpensesChartProps {
  transactions: Transaction[];
}

export function IncomeVsExpensesChart({ transactions }: IncomeVsExpensesChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Calculate current month totals
    const currentMonthTransactions = transactions.filter((tx) =>
      isWithinInterval(new Date(tx.date), { start: currentMonthStart, end: currentMonthEnd })
    );

    const currentIncome = currentMonthTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const currentExpenses = Math.abs(
      currentMonthTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0)
    );

    // Calculate previous month totals
    const previousMonthTransactions = transactions.filter((tx) =>
      isWithinInterval(new Date(tx.date), { start: previousMonthStart, end: previousMonthEnd })
    );

    const previousIncome = previousMonthTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const previousExpenses = Math.abs(
      previousMonthTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0)
    );

    return [
      {
        month: format(previousMonthStart, "MMM yyyy"),
        income: previousIncome,
        expenses: previousExpenses,
      },
      {
        month: format(currentMonthStart, "MMM yyyy"),
        income: currentIncome,
        expenses: currentExpenses,
      },
    ];
  }, [transactions]);

  const netIncome = useMemo(() => {
    const current = chartData[1];
    return current ? current.income - current.expenses : 0;
  }, [chartData]);

  return (
    <Card className="border-previa-sand">
      <CardHeader>
        <CardTitle className="text-previa-charcoal font-semibold">Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-stone">Net Income (This Month)</p>
          <p
            className={`text-2xl font-mono font-bold ${
              netIncome >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netIncome >= 0 ? "+" : ""}${netIncome.toFixed(2)}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" opacity={0.3} />
            <XAxis
              dataKey="month"
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
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="rect"
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

