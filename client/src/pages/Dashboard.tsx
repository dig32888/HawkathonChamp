import { useState } from "react";
import { BalanceCard } from "@/components/BalanceCard";
import { DailyBudgetCalculator } from "@/components/DailyBudgetCalculator";
import { SemesterTimeline } from "@/components/SemesterTimeline";
import { QuickActions } from "@/components/QuickActions";
import { SpendingChart } from "@/components/SpendingChart";
import { OnboardingDialog, OnboardingData } from "@/components/OnboardingDialog";
import { DollarSign, Utensils, RefreshCw, CreditCard } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function Dashboard() {
  //todo: remove mock functionality
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mealPlanData, setMealPlanData] = useState<OnboardingData | null>({
    semesterStart: new Date(2025, 0, 15),
    semesterEnd: new Date(2025, 4, 10),
    diningDollars: 500,
    mealSwipes: 100,
    mealExchanges: 20,
    debitBalance: 300,
    mealsPerDay: 3,
  });

  const handleOnboardingComplete = (data: OnboardingData) => {
    setMealPlanData(data);
    setShowOnboarding(false);
  };

  //todo: remove mock functionality - spending data
  const mockSpendingData = [
    { date: 'Week 1', diningDollars: 50, swipes: 15, debit: 30 },
    { date: 'Week 2', diningDollars: 45, swipes: 12, debit: 25 },
    { date: 'Week 3', diningDollars: 60, swipes: 18, debit: 35 },
    { date: 'Week 4', diningDollars: 40, swipes: 10, debit: 20 },
  ];

  if (!mealPlanData) {
    return <OnboardingDialog open={true} onComplete={handleOnboardingComplete} />;
  }

  const daysRemaining = differenceInDays(mealPlanData.semesterEnd, new Date());
  const diningDollarsDaily = daysRemaining > 0 ? mealPlanData.diningDollars / daysRemaining : 0;
  const swipesDaily = daysRemaining > 0 ? mealPlanData.mealSwipes / daysRemaining : 0;
  const exchangesDaily = daysRemaining > 0 ? mealPlanData.mealExchanges / daysRemaining : 0;
  const debitDaily = daysRemaining > 0 ? mealPlanData.debitBalance / daysRemaining : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Track your meal plan and budget for the semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          title="Dining Dollars"
          current={mealPlanData.diningDollars}
          total={500}
          icon={DollarSign}
          iconColor="text-chart-1"
          isCurrency={true}
        />
        <BalanceCard
          title="Meal Swipes"
          current={mealPlanData.mealSwipes}
          total={100}
          icon={Utensils}
          iconColor="text-chart-2"
        />
        <BalanceCard
          title="Meal Exchanges"
          current={mealPlanData.mealExchanges}
          total={20}
          icon={RefreshCw}
          iconColor="text-chart-3"
        />
        <BalanceCard
          title="Debit Card"
          current={mealPlanData.debitBalance}
          total={300}
          icon={CreditCard}
          iconColor="text-chart-1"
          isCurrency={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyBudgetCalculator
            daysRemaining={daysRemaining}
            diningDollarsDaily={diningDollarsDaily}
            swipesDaily={swipesDaily}
            exchangesDaily={exchangesDaily}
            debitDaily={debitDaily}
          />
        </div>
        <SemesterTimeline
          startDate={mealPlanData.semesterStart}
          endDate={mealPlanData.semesterEnd}
        />
      </div>

      <QuickActions
        onLogMeal={() => console.log('Log meal')}
        onAddExpense={() => console.log('Add expense')}
        onAddBudget={() => console.log('Add budget')}
      />

      <SpendingChart data={mockSpendingData} />

      {showOnboarding && (
        <OnboardingDialog open={showOnboarding} onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
