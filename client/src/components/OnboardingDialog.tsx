import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  semesterStart: Date;
  semesterEnd: Date;
  diningDollars: number;
  mealSwipes: number;
  mealExchanges: number;
  debitBalance: number;
  mealsPerDay: number;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    mealsPerDay: 3,
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (formData.semesterStart && formData.semesterEnd) {
      onComplete(formData as OnboardingData);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.semesterStart && formData.semesterEnd;
    }
    if (step === 2) {
      return (
        formData.diningDollars !== undefined &&
        formData.mealSwipes !== undefined &&
        formData.mealExchanges !== undefined &&
        formData.debitBalance !== undefined
      );
    }
    return formData.mealsPerDay !== undefined;
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-onboarding">
        <DialogHeader>
          <DialogTitle>Welcome to MealPlan Manager</DialogTitle>
          <DialogDescription>
            Let's set up your semester meal plan. Step {step} of 3
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Semester Dates</h3>
              
              <div className="space-y-2">
                <Label>Semester Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.semesterStart && "text-muted-foreground"
                      )}
                      data-testid="button-select-start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.semesterStart ? format(formData.semesterStart, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.semesterStart}
                      onSelect={(date) => setFormData({ ...formData, semesterStart: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Semester End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.semesterEnd && "text-muted-foreground"
                      )}
                      data-testid="button-select-end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.semesterEnd ? format(formData.semesterEnd, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.semesterEnd}
                      onSelect={(date) => setFormData({ ...formData, semesterEnd: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium">Meal Plan Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diningDollars">Dining Dollars</Label>
                  <Input
                    id="diningDollars"
                    type="number"
                    placeholder="500"
                    value={formData.diningDollars || ""}
                    onChange={(e) => setFormData({ ...formData, diningDollars: Number(e.target.value) })}
                    data-testid="input-dining-dollars"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealSwipes">Meal Swipes</Label>
                  <Input
                    id="mealSwipes"
                    type="number"
                    placeholder="100"
                    value={formData.mealSwipes || ""}
                    onChange={(e) => setFormData({ ...formData, mealSwipes: Number(e.target.value) })}
                    data-testid="input-meal-swipes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealExchanges">Meal Exchanges</Label>
                  <Input
                    id="mealExchanges"
                    type="number"
                    placeholder="20"
                    value={formData.mealExchanges || ""}
                    onChange={(e) => setFormData({ ...formData, mealExchanges: Number(e.target.value) })}
                    data-testid="input-meal-exchanges"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debitBalance">Debit Card Balance</Label>
                  <Input
                    id="debitBalance"
                    type="number"
                    placeholder="300"
                    value={formData.debitBalance || ""}
                    onChange={(e) => setFormData({ ...formData, debitBalance: Number(e.target.value) })}
                    data-testid="input-debit-balance"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">Daily Meal Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">How many meals per day do you want?</Label>
                <Input
                  id="mealsPerDay"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.mealsPerDay || 3}
                  onChange={(e) => setFormData({ ...formData, mealsPerDay: Number(e.target.value) })}
                  data-testid="input-meals-per-day"
                />
                <p className="text-sm text-muted-foreground">
                  We'll help you ration your meal plan based on this preference
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              data-testid="button-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid()}
              data-testid="button-complete"
            >
              Complete Setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
