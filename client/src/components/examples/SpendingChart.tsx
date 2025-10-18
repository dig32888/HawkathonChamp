import { SpendingChart } from '../SpendingChart';

export default function SpendingChartExample() {
  const mockData = [
    { date: 'Week 1', diningDollars: 50, swipes: 15, debit: 30 },
    { date: 'Week 2', diningDollars: 45, swipes: 12, debit: 25 },
    { date: 'Week 3', diningDollars: 60, swipes: 18, debit: 35 },
    { date: 'Week 4', diningDollars: 40, swipes: 10, debit: 20 },
    { date: 'Week 5', diningDollars: 55, swipes: 14, debit: 28 },
  ];

  return (
    <div className="p-4">
      <SpendingChart data={mockData} />
    </div>
  );
}
