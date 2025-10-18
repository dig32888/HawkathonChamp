import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertBudgetCategorySchema, insertTransactionSchema, type Semester, type BudgetCategory, type InsertBudgetCategory, type InsertTransaction } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Home, ShoppingCart, Car, Heart, BookOpen, DollarSign, Plus, TrendingUp, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categoryPresets = [
  { name: "Housing", icon: "Home", color: "#3b82f6" },
  { name: "Groceries", icon: "ShoppingCart", color: "#10b981" },
  { name: "Transportation", icon: "Car", color: "#f59e0b" },
  { name: "Entertainment", icon: "Heart", color: "#ec4899" },
  { name: "Books & Supplies", icon: "BookOpen", color: "#8b5cf6" },
  { name: "Personal Care", icon: "Wallet", color: "#06b6d4" },
];

const budgetCategoryFormSchema = insertBudgetCategorySchema.extend({
  allocatedAmount: z.string(),
});

const transactionFormSchema = z.object({
  categoryId: z.string(),
  amount: z.string(),
  description: z.string(),
  date: z.string(),
});

export default function Budget() {
  const { toast } = useToast();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const { data: semester, isLoading: semesterLoading } = useQuery<Semester>({
    queryKey: ["/api/semester/active"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<BudgetCategory[]>({
    queryKey: ["/api/budget-categories"],
    enabled: !!semester,
  });

  const categoryForm = useForm<z.infer<typeof budgetCategoryFormSchema>>({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      semesterId: "",
      name: "",
      allocatedAmount: "",
      spentAmount: "0",
      icon: "Wallet",
      color: "#3b82f6",
    },
  });

  const expenseForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      categoryId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertBudgetCategory) => {
      return await apiRequest("POST", "/api/budget-categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-categories"] });
      setIsAddCategoryOpen(false);
      categoryForm.reset();
      toast({
        title: "Category created!",
        description: "Your budget category has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      return await apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      setIsAddExpenseOpen(false);
      expenseForm.reset({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
      });
      toast({
        title: "Expense added!",
        description: "Your expense has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitCategory = (data: z.infer<typeof budgetCategoryFormSchema>) => {
    if (!semester) return;

    const categoryData: InsertBudgetCategory = {
      semesterId: semester.id,
      name: data.name,
      allocatedAmount: data.allocatedAmount,
      spentAmount: "0",
      icon: data.icon,
      color: data.color,
    };

    createCategoryMutation.mutate(categoryData);
  };

  const onSubmitExpense = (data: z.infer<typeof transactionFormSchema>) => {
    if (!semester) return;

    const transactionData: InsertTransaction = {
      semesterId: semester.id,
      type: "expense",
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date,
    };

    createTransactionMutation.mutate(transactionData);
  };

  const handlePresetSelect = (preset: typeof categoryPresets[0]) => {
    categoryForm.setValue("name", preset.name);
    categoryForm.setValue("icon", preset.icon);
    categoryForm.setValue("color", preset.color);
  };

  if (semesterLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Wallet className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Set Up Your Semester First</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You need to set up your meal plan before creating budget categories.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = categories?.reduce((sum, cat) => sum + parseFloat(cat.allocatedAmount), 0) || 0;
  const totalSpent = categories?.reduce((sum, cat) => sum + parseFloat(cat.spentAmount), 0) || 0;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budget Planner</h1>
            <p className="text-muted-foreground">
              Manage your spending across different categories
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-open-add-expense">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense to track your spending
                  </DialogDescription>
                </DialogHeader>
                <Form {...expenseForm}>
                  <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-4">
                    <FormField
                      control={expenseForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-expense-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What did you spend on?"
                              {...field}
                              data-testid="input-expense-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
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
                                data-testid="input-expense-amount"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-expense-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createTransactionMutation.isPending}
                      data-testid="button-submit-expense"
                    >
                      {createTransactionMutation.isPending ? "Adding..." : "Add Expense"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-open-add-category">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Budget Category</DialogTitle>
                  <DialogDescription>
                    Create a new budget category to track your spending
                  </DialogDescription>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Quick Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {categoryPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-auto py-3 flex flex-col items-center gap-1"
                            onClick={() => handlePresetSelect(preset)}
                            data-testid={`button-preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: preset.color }}
                            >
                              <div className="h-3 w-3 bg-white rounded-full" />
                            </div>
                            <span className="text-xs">{preset.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Housing"
                              {...field}
                              data-testid="input-category-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="allocatedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-9"
                                {...field}
                                data-testid="input-category-amount"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input type="color" {...field} data-testid="input-category-color" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createCategoryMutation.isPending}
                      data-testid="button-submit-category"
                    >
                      {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>
              Overview of your total budget allocation and spending
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-3xl font-bold tabular-nums" data-testid="text-total-budget">
                  ${totalBudget.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold tabular-nums" data-testid="text-total-spent">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
            <Progress value={budgetProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              ${(totalBudget - totalSpent).toFixed(2)} remaining ({(100 - budgetProgress).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => {
              const spent = parseFloat(category.spentAmount);
              const allocated = parseFloat(category.allocatedAmount);
              const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
              const remaining = allocated - spent;

              return (
                <Card key={category.id} data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <div className="h-4 w-4 bg-white rounded-full" />
                      </div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold tabular-nums">
                        ${spent.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of ${allocated.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      ${remaining.toFixed(2)} remaining
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Budget Categories Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first budget category to start tracking your spending
                </p>
                <Button onClick={() => setIsAddCategoryOpen(true)} data-testid="button-create-first-category">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget Category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
