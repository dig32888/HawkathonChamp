import { BalanceCard } from '../BalanceCard';
import { DollarSign } from 'lucide-react';

export default function BalanceCardExample() {
  return (
    <div className="p-4">
      <BalanceCard
        title="Dining Dollars"
        current={350}
        total={500}
        icon={DollarSign}
        iconColor="text-chart-1"
        isCurrency={true}
      />
    </div>
  );
}
