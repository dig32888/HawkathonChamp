import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Semester, Transaction, MealLog } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: semester, isLoading: semesterLoading } = useQuery<Semester>({
    queryKey: ["/api/semester/active"],
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!semester,
  });

  const { data: mealLogs } = useQuery<MealLog[]>({
    queryKey: ["/api/meal-logs"],
    enabled: !!semester,
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getSpendingForDate = (date: Date) => {
    if (!transactions) return 0;
    
    const dateStr = date.toISOString().split('T')[0];
    return transactions
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const getMealsForDate = (date: Date) => {
    if (!mealLogs) return 0;
    
    const dateStr = date.toISOString().split('T')[0];
    return mealLogs.filter(m => m.date === dateStr).length;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  const isCurrentMonth = 
    currentDate.getMonth() === today.getMonth() && 
    currentDate.getFullYear() === today.getFullYear();

  if (semesterLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-semibold mb-2">Set Up Your Semester First</h2>
            <p className="text-muted-foreground">
              You need to set up your meal plan before viewing the calendar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">
            Track your daily spending and meal usage
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="text-calendar-month">{monthName}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  data-testid="button-previous-month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const spending = getSpendingForDate(date);
                const meals = getMealsForDate(date);
                const isToday = 
                  isCurrentMonth && 
                  day === today.getDate();

                let statusColor = "bg-muted";
                if (spending > 0) {
                  if (spending < 20) {
                    statusColor = "bg-chart-2/20";
                  } else if (spending < 50) {
                    statusColor = "bg-chart-3/20";
                  } else {
                    statusColor = "bg-chart-5/20";
                  }
                }

                return (
                  <div
                    key={day}
                    className={`aspect-square p-2 rounded-md ${statusColor} ${
                      isToday ? "ring-2 ring-primary" : ""
                    }`}
                    data-testid={`calendar-day-${day}`}
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-sm font-medium mb-1">{day}</span>
                      <div className="flex-1 flex flex-col gap-1 text-xs">
                        {meals > 0 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0 h-auto">
                            {meals} meal{meals > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {spending > 0 && (
                          <span className="text-muted-foreground font-medium tabular-nums">
                            ${spending.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-2/20" />
                <span className="text-muted-foreground">Low spending (&lt;$20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-3/20" />
                <span className="text-muted-foreground">Medium ($20-$50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-5/20" />
                <span className="text-muted-foreground">High (&gt;$50)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
