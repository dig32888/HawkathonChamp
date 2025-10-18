import { useState } from "react";
import { BudgetCategoryCard } from "@/components/BudgetCategoryCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetCategory {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
}

export default function Budget() {
  //todo: remove mock functionality
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "1", category: "Housing", budgeted: 800, spent: 800 },
    { id: "2", category: "Groceries", budgeted: 200, spent: 145.50 },
    { id: "3", category: "Books & Supplies", budgeted: 300, spent: 275 },
    { id: "4", category: "Entertainment", budgeted: 100, spent: 45 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ category: "", budgeted: "" });

  const handleAddCategory = () => {
    if (newCategory.category && newCategory.budgeted) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          category: newCategory.category,
          budgeted: Number(newCategory.budgeted),
          spent: 0,
        },
      ]);
      setNewCategory({ category: "", budgeted: "" });
      setDialogOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-page-title">Budget</h1>
          <p className="text-muted-foreground">Manage your semester spending goals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  placeholder="e.g., Transportation"
                  value={newCategory.category}
                  onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                  data-testid="input-category-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={newCategory.budgeted}
                  onChange={(e) => setNewCategory({ ...newCategory, budgeted: e.target.value })}
                  data-testid="input-category-amount"
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full" data-testid="button-save-category">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card rounded-lg border">
        <div>
          <div className="text-sm text-muted-foreground">Total Budgeted</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-total-budgeted">
            ${totalBudgeted.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total Spent</div>
          <div className="text-2xl font-semibold tabular-nums" data-testid="text-total-spent">
            ${totalSpent.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Remaining</div>
          <div className={`text-2xl font-semibold tabular-nums ${totalRemaining < 0 ? 'text-destructive' : ''}`} data-testid="text-total-remaining">
            ${totalRemaining.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <BudgetCategoryCard
            key={category.id}
            category={category.category}
            budgeted={category.budgeted}
            spent={category.spent}
            onEdit={() => console.log('Edit', category.id)}
            onDelete={() => handleDelete(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
