import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSemesterSchema, type Semester, type InsertSemester, type InsertMealLog } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign, Ticket, CreditCard, Utensils, Check, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const setupSchema = insertSemesterSchema.extend({
  startDate: z.string(),
  endDate: z.string(),
  initialDiningDollars: z.string(),
  initialDebitCard: z.string(),
});

const mealLogSchema = z.object({
  date: z.string(),
  mealType: z.string(),
  paymentMethod: z.string(),
  amount: z.string().optional(),
});

export default function MealPlan() {
  const { toast } = useToast();
  const [setupStep, setSetupStep] = useState(1);
  
  const { data: semester, isLoading } = useQuery<Semester>({
    queryKey: ["/api/semester/active"],
  });

  const form = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      initialDiningDollars: "",
      initialMealSwipes: 0,
      initialMealExchanges: 0,
      initialDebitCard: "",
      currentDiningDollars: "",
      currentMealSwipes: 0,
      currentMealExchanges: 0,
      currentDebitCard: "",
      mealsPerDay: 3,
      isActive: true,
    },
  });

  const mealLogForm = useForm<z.infer<typeof mealLogSchema>>({
    resolver: zodResolver(mealLogSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      mealType: "",
      paymentMethod: "",
      amount: "",
    },
  });

  const createSemesterMutation = useMutation({
    mutationFn: async (data: InsertSemester) => {
      return await apiRequest("POST", "/api/semester", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semester/active"] });
      toast({
        title: "Semester created!",
        description: "Your meal plan has been set up successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create semester. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logMealMutation = useMutation({
    mutationFn: async (data: InsertMealLog) => {
      return await apiRequest("POST", "/api/meal-logs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semester/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      mealLogForm.reset({
        date: new Date().toISOString().split('T')[0],
        mealType: "",
        paymentMethod: "",
        amount: "",
      });
      toast({
        title: "Meal logged!",
        description: "Your meal has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitSetup = (data: z.infer<typeof setupSchema>) => {
    const semesterData: InsertSemester = {
      ...data,
      initialDiningDollars: data.initialDiningDollars,
      initialDebitCard: data.initialDebitCard,
      currentDiningDollars: data.initialDiningDollars,
      currentDebitCard: data.initialDebitCard,
      currentMealSwipes: data.initialMealSwipes,
      currentMealExchanges: data.initialMealExchanges,
    };
    createSemesterMutation.mutate(semesterData);
  };

  const onSubmitMealLog = (data: z.infer<typeof mealLogSchema>) => {
    if (!semester) return;

    const mealLog: InsertMealLog = {
      semesterId: semester.id,
      date: data.date,
      mealType: data.mealType,
      paymentMethod: data.paymentMethod,
      amount: data.amount || null,
    };
    
    logMealMutation.mutate(mealLog);
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Set Up Your Meal Plan</h1>
            <p className="text-muted-foreground">
              Enter your semester details and meal plan information to get started
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step === setupStep
                        ? "bg-primary text-primary-foreground"
                        : step < setupStep
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step < setupStep ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs font-medium flex-1">Semester Info</span>
              <span className="text-xs font-medium flex-1">Meal Plan</span>
              <span className="text-xs font-medium flex-1">Preferences</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitSetup)} className="space-y-6">
              {setupStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Semester Information</CardTitle>
                    <CardDescription>
                      Set up your semester dates and name
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Fall 2024"
                              {...field}
                              data-testid="input-semester-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                data-testid="input-start-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                data-testid="input-end-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setSetupStep(2)}
                      className="w-full"
                      data-testid="button-next-step-1"
                    >
                      Next: Meal Plan Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {setupStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Meal Plan Balances</CardTitle>
                    <CardDescription>
                      Enter your initial meal plan balances for the semester
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="initialDiningDollars"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dining Dollars</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-9"
                                {...field}
                                data-testid="input-dining-dollars"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="initialMealSwipes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Swipes</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="0"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="input-meal-swipes"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="initialMealExchanges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Exchanges</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="0"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="input-meal-exchanges"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="initialDebitCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Debit Card Balance</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-9"
                                {...field}
                                data-testid="input-debit-card"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSetupStep(1)}
                        className="flex-1"
                        data-testid="button-back-step-2"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setSetupStep(3)}
                        className="flex-1"
                        data-testid="button-next-step-2"
                      >
                        Next: Preferences
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {setupStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Meal Preferences</CardTitle>
                    <CardDescription>
                      Set your daily meal preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mealsPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meals Per Day</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                data-testid="button-decrease-meals"
                              >
                                -
                              </Button>
                              <span className="text-2xl font-bold tabular-nums min-w-[3ch] text-center">
                                {field.value}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange(Math.min(5, field.value + 1))}
                                data-testid="button-increase-meals"
                              >
                                +
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSetupStep(2)}
                        className="flex-1"
                        data-testid="button-back-step-3"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={createSemesterMutation.isPending}
                        className="flex-1"
                        data-testid="button-create-semester"
                      >
                        {createSemesterMutation.isPending ? "Creating..." : "Create Semester"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meal Plan Tracker</h1>
          <p className="text-muted-foreground">
            Log your meals and track your usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meal Swipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {semester.currentMealSwipes}
              </div>
              <p className="text-xs text-muted-foreground">
                of {semester.initialMealSwipes} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dining Dollars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                ${parseFloat(semester.currentDiningDollars).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                of ${parseFloat(semester.initialDiningDollars).toFixed(2)} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meal Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {semester.currentMealExchanges}
              </div>
              <p className="text-xs text-muted-foreground">
                of {semester.initialMealExchanges} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log a Meal</CardTitle>
            <CardDescription>
              Record your meal to update your balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...mealLogForm}>
              <form onSubmit={mealLogForm.handleSubmit(onSubmitMealLog)} className="space-y-4">
                <FormField
                  control={mealLogForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-meal-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mealLogForm.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-meal-type">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mealLogForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="meal-swipe">Meal Swipe</SelectItem>
                          <SelectItem value="dining-dollars">Dining Dollars</SelectItem>
                          <SelectItem value="meal-exchange">Meal Exchange</SelectItem>
                          <SelectItem value="debit-card">Debit Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(mealLogForm.watch("paymentMethod") === "dining-dollars" ||
                  mealLogForm.watch("paymentMethod") === "debit-card") && (
                  <FormField
                    control={mealLogForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-9"
                              {...field}
                              data-testid="input-meal-amount"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={logMealMutation.isPending}
                  data-testid="button-submit-meal-log"
                >
                  {logMealMutation.isPending ? "Logging..." : "Log Meal"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
