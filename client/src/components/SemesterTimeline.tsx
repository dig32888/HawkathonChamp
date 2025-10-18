import { Card } from "@/components/ui/card";
import { Calendar, TrendingDown } from "lucide-react";
import { differenceInDays, format } from "date-fns";

interface SemesterTimelineProps {
  startDate: Date;
  endDate: Date;
}

export function SemesterTimeline({ startDate, endDate }: SemesterTimelineProps) {
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = differenceInDays(today, startDate);
  const daysRemaining = differenceInDays(endDate, today);
  const percentage = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;

  return (
    <Card className="p-6" data-testid="card-semester-timeline">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Semester Timeline</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-muted-foreground">Start</div>
            <div className="font-medium" data-testid="text-semester-start">{format(startDate, "MMM d, yyyy")}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground">End</div>
            <div className="font-medium" data-testid="text-semester-end">{format(endDate, "MMM d, yyyy")}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{daysElapsed} days elapsed</span>
            <span>{daysRemaining} days remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground" data-testid="text-days-remaining">{daysRemaining}</span> days left to manage your resources
          </span>
        </div>
      </div>
    </Card>
  );
}
