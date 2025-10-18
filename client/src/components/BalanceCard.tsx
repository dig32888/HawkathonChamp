import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BalanceCardProps {
  title: string;
  current: number;
  total: number;
  icon: LucideIcon;
  iconColor?: string;
  isCurrency?: boolean;
}

export function BalanceCard({
  title,
  current,
  total,
  icon: Icon,
  iconColor = "text-primary",
  isCurrency = false,
}: BalanceCardProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isLow = percentage < 30;
  const isMedium = percentage >= 30 && percentage < 60;

  const progressColor = isLow
    ? "bg-chart-4"
    : isMedium
    ? "bg-chart-3"
    : "bg-chart-2";

  const formatValue = (value: number) => {
    if (isCurrency) {
      return `$${value.toFixed(2)}`;
    }
    return value.toString();
  };

  return (
    <Card className="p-6" data-testid={`card-balance-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-3xl font-semibold tabular-nums" data-testid={`text-current-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {formatValue(current)}
          </div>
          <div className="text-sm text-muted-foreground">
            of {formatValue(total)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(0)}% remaining</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
