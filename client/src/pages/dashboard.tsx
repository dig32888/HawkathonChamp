import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Ticket, CreditCard, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Semester, BudgetCategory, Transaction } from "@shared/schema";

export default function Dashboard() {
  const { data: semester, isLoading: semesterLoading } = useQuery<Semester>({
    queryKey: ["/api/semester/active"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<BudgetCategory[]>({
    queryKey: ["/api/budget-categories"],
    enabled: !!semester,
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/recent"],
    enabled: !!semester,
  });

  if (semesterLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Start Your Semester Right!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Set up your meal plan to begin tracking your dining dollars, meal swipes, and budget.
            </p>
            <Link href="/meal-plan">
              <Button size="lg" data-testid="button-setup-semester">
                <Plus className="h-4 w-4 mr-2" />
                Set Up Meal Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(semester.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const totalDays = Math.ceil(
    (new Date(semester.endDate).getTime() - new Date(semester.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const dailyDiningDollarsBudget = daysLeft > 0 ? parseFloat(semester.currentDiningDollars) / daysLeft : 0;
  const dailyMealSwipes = daysLeft > 0 ? semester.currentMealSwipes / daysLeft : 0;

  const swipesProgress = ((semester.initialMealSwipes - semester.currentMealSwipes) / semester.initialMealSwipes) * 100;
  const dollarsProgress = ((parseFloat(semester.initialDiningDollars) - parseFloat(semester.currentDiningDollars)) / parseFloat(semester.initialDiningDollars)) * 100;

  const totalBudget = categories?.reduce((sum, cat) => sum + parseFloat(cat.allocatedAmount), 0) || 0;
  const totalSpent = categories?.reduce((sum, cat) => sum + parseFloat(cat.spentAmount), 0) || 0;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{semester.name}</h1>
          <p className="text-muted-foreground">
            {daysLeft} days remaining · Track your spending and meal plan usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="card-meal-swipes">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meal Swipes
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums" data-testid="text-swipes-remaining">
                {semester.currentMealSwipes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                of {semester.initialMealSwipes} remaining
              </p>
              <Progress value={100 - swipesProgress} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                ~{dailyMealSwipes.toFixed(1)} swipes/day
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-dining-dollars">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dining Dollars
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums" data-testid="text-dining-dollars">
                ${parseFloat(semester.currentDiningDollars).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                of ${parseFloat(semester.initialDiningDollars).toFixed(2)} remaining
              </p>
              <Progress value={100 - dollarsProgress} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                ~${dailyDiningDollarsBudget.toFixed(2)}/day
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-debit-card">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Debit Card
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums" data-testid="text-debit-balance">
                ${parseFloat(semester.currentDebitCard).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available balance
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-budget">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Budget Status
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums" data-testid="text-budget-spent">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                of ${totalBudget.toFixed(2)} spent
              </p>
              <Progress 
                value={budgetProgress} 
                className="mt-3 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {(100 - budgetProgress).toFixed(0)}% remaining
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => {
                  const spent = parseFloat(category.spentAmount);
                  const allocated = parseFloat(category.allocatedAmount);
                  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
                  
                  return (
                    <div key={category.id} className="space-y-2" data-testid={`budget-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        <span className="text-sm tabular-nums text-muted-foreground">
                          ${spent.toFixed(2)} / ${allocated.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">No budget categories yet</p>
                  <Link href="/budget">
                    <Button variant="outline" size="sm" data-testid="button-create-budget">
                      Create Budget Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2"
                      data-testid={`transaction-${transaction.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          {transaction.type === 'meal' ? (
                            <Ticket className="h-4 w-4" />
                          ) : (
                            <DollarSign className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Link href="/meal-plan">
            <Button data-testid="button-log-meal">
              <Plus className="h-4 w-4 mr-2" />
              Log Meal
            </Button>
          </Link>
          <Link href="/budget">
            <Button variant="outline" data-testid="button-add-expense">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
