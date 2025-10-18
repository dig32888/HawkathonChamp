import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface BudgetCategoryCardProps {
  category: string;
  budgeted: number;
  spent: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetCategoryCard({
  category,
  budgeted,
  spent,
  onEdit,
  onDelete,
}: BudgetCategoryCardProps) {
  const remaining = budgeted - spent;
  const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const isOverBudget = spent > budgeted;

  const progressColor = isOverBudget
    ? "bg-chart-4"
    : percentage > 80
    ? "bg-chart-3"
    : "bg-chart-2";

  return (
    <Card className="p-4" data-testid={`card-budget-${category.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium">{category}</h4>
          {isOverBudget && (
            <Badge variant="destructive" className="mt-1">
              Over Budget
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              data-testid={`button-edit-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              data-testid={`button-delete-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Spent</span>
          <span className="text-lg font-semibold tabular-nums" data-testid={`text-spent-${category.toLowerCase().replace(/\s+/g, '-')}`}>
            ${spent.toFixed(2)}
          </span>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Budget: ${budgeted.toFixed(2)}</span>
          <span className={isOverBudget ? "text-destructive font-medium" : ""}>
            {isOverBudget ? "Over by" : "Remaining"}: ${Math.abs(remaining).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
