import { BudgetCategoryCard } from '../BudgetCategoryCard';

export default function BudgetCategoryCardExample() {
  return (
    <div className="p-4 space-y-4">
      <BudgetCategoryCard
        category="Housing"
        budgeted={800}
        spent={800}
        onEdit={() => console.log('Edit Housing')}
        onDelete={() => console.log('Delete Housing')}
      />
      <BudgetCategoryCard
        category="Groceries"
        budgeted={200}
        spent={145.50}
        onEdit={() => console.log('Edit Groceries')}
        onDelete={() => console.log('Delete Groceries')}
      />
    </div>
  );
}
