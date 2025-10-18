import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, DollarSign, Utensils, CreditCard } from "lucide-react";

interface QuickActionsProps {
  onLogMeal: () => void;
  onAddExpense: () => void;
  onAddBudget: () => void;
}

export function QuickActions({ onLogMeal, onAddExpense, onAddBudget }: QuickActionsProps) {
  return (
    <Card className="p-6" data-testid="card-quick-actions">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={onLogMeal}
          className="justify-start gap-3"
          variant="outline"
          data-testid="button-log-meal"
        >
          <Utensils className="h-5 w-5" />
          <span>Log Meal</span>
        </Button>

        <Button
          onClick={onAddExpense}
          className="justify-start gap-3"
          variant="outline"
          data-testid="button-add-expense"
        >
          <DollarSign className="h-5 w-5" />
          <span>Add Expense</span>
        </Button>

        <Button
          onClick={onAddBudget}
          className="justify-start gap-3"
          variant="outline"
          data-testid="button-add-budget"
        >
          <CreditCard className="h-5 w-5" />
          <span>Add Budget</span>
        </Button>
      </div>
    </Card>
  );
}
