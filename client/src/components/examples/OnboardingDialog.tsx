import { OnboardingDialog } from '../OnboardingDialog';

export default function OnboardingDialogExample() {
  return (
    <OnboardingDialog
      open={true}
      onComplete={(data) => console.log('Onboarding complete:', data)}
    />
  );
}
