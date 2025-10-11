import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { Transaction } from "@/types/financial";

interface UnreconciledAlertProps {
  transactions: Transaction[];
}

export function UnreconciledAlert({ transactions }: UnreconciledAlertProps) {
  const navigate = useNavigate();

  const unreconciledCount = useMemo(() => {
    return transactions.filter((tx) => tx.status === "unreconciled").length;
  }, [transactions]);

  const unreconciledAmount = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === "unreconciled")
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [transactions]);

  if (unreconciledCount === 0) {
    return (
      <Card
        className="border-previa-sand"
        role="status"
        aria-live="polite"
        aria-label="All transactions reconciled"
      >
        <CardHeader>
          <CardTitle className="text-previa-charcoal font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            All Reconciled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-previa-stone text-sm">
            Great job! All your transactions are reconciled.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-amber-200"
      role="alert"
      aria-live="polite"
      aria-label={`Warning: ${unreconciledCount} unreconciled items`}
    >
      <CardHeader>
        <CardTitle className="text-previa-charcoal font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center" aria-hidden="true">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          Unreconciled Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-previa-stone mb-1">Items Pending Review</p>
          <p className="text-3xl font-bold text-previa-charcoal" aria-live="polite">{unreconciledCount}</p>
          <p className="text-sm text-previa-stone mt-1">
            Total Amount:{" "}
            <span className="font-mono font-semibold text-previa-charcoal">
              ${unreconciledAmount.toFixed(2)}
            </span>
          </p>
        </div>
        <Button
          onClick={() => navigate("/reconciliation")}
          aria-label={`Review ${unreconciledCount} unreconciled items`}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white focus:outline-none focus:ring-2 focus:ring-sand focus:ring-offset-2"
        >
          Review Now
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}

