import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface DailyBudgetCalculatorProps {
  daysRemaining: number;
  diningDollarsDaily: number;
  swipesDaily: number;
  exchangesDaily: number;
  debitDaily: number;
}

export function DailyBudgetCalculator({
  daysRemaining,
  diningDollarsDaily,
  swipesDaily,
  exchangesDaily,
  debitDaily,
}: DailyBudgetCalculatorProps) {
  return (
    <Card className="p-6" data-testid="card-daily-budget">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Daily Budget Recommendations</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Dining Dollars</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-daily-dining-dollars">
            ${diningDollarsDaily.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Meal Swipes</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-daily-swipes">
            {swipesDaily.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Meal Exchanges</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-daily-exchanges">
            {exchangesDaily.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Debit Card</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-daily-debit">
            ${debitDaily.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{daysRemaining} days</span> remaining in semester
        </div>
      </div>
    </Card>
  );
}
