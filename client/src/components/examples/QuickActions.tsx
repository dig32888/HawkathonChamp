import { QuickActions } from '../QuickActions';

export default function QuickActionsExample() {
  return (
    <div className="p-4">
      <QuickActions
        onLogMeal={() => console.log('Log meal clicked')}
        onAddExpense={() => console.log('Add expense clicked')}
        onAddBudget={() => console.log('Add budget clicked')}
      />
    </div>
  );
}
