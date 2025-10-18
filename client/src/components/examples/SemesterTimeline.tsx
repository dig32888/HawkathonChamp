import { SemesterTimeline } from '../SemesterTimeline';
import { addDays, subDays } from 'date-fns';

export default function SemesterTimelineExample() {
  const startDate = subDays(new Date(), 75);
  const endDate = addDays(new Date(), 45);

  return (
    <div className="p-4">
      <SemesterTimeline startDate={startDate} endDate={endDate} />
    </div>
  );
}
