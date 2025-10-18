import { DailyBudgetCalculator } from '../DailyBudgetCalculator';

export default function DailyBudgetCalculatorExample() {
  return (
    <div className="p-4">
      <DailyBudgetCalculator
        daysRemaining={45}
        diningDollarsDaily={7.78}
        swipesDaily={2.2}
        exchangesDaily={0.4}
        debitDaily={11.11}
      />
    </div>
  );
}
