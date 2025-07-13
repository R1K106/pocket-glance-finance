import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Healthcare", "Other Expense"]
};

export function FinanceApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddingTransaction(false);

    toast({
      title: "Transaction Added",
      description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} added successfully.`,
    });
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between glass-effect p-6 rounded-2xl backdrop-blur-xl hover-lift">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-apple-md animate-bounce-gentle">
              <Wallet className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Pocket Finance</h1>
              <p className="text-muted-foreground text-lg">Track your money, achieve your goals</p>
            </div>
          </div>

          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button className="gap-3 px-6 py-3 text-lg button-apple animate-scale-in hover-lift">
                <PlusCircle className="h-5 w-5" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="card-apple max-w-md animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: "income" | "expense") => 
                        setFormData({...formData, type: value, category: ""})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES[formData.type].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <Button onClick={handleAddTransaction} className="w-full button-apple py-3 text-lg font-medium">
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="card-apple border-l-4 border-l-balance/50 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-muted-foreground">Current Balance</CardTitle>
              <div className="p-2 bg-balance/10 rounded-xl">
                <DollarSign className="h-5 w-5 text-balance" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold tracking-tight ${balance >= 0 ? 'text-balance' : 'text-expense'}`}>
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="card-apple border-l-4 border-l-income/50 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-muted-foreground">Total Income</CardTitle>
              <div className="p-2 bg-income/10 rounded-xl">
                <TrendingUp className="h-5 w-5 text-income" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-income tracking-tight">${totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="card-apple border-l-4 border-l-expense/50 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-muted-foreground">Total Expenses</CardTitle>
              <div className="p-2 bg-expense/10 rounded-xl">
                <TrendingDown className="h-5 w-5 text-expense" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-expense tracking-tight">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6 animate-slide-up">
          <TabsList className="glass-effect p-2 h-auto shadow-apple-sm">
            <TabsTrigger value="dashboard" className="px-6 py-3 text-base font-medium rounded-xl transition-all duration-300 data-[state=active]:shadow-apple-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions" className="px-6 py-3 text-base font-medium rounded-xl transition-all duration-300 data-[state=active]:shadow-apple-sm">All Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <Card className="card-apple overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
                <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground animate-fade-in">
                    <div className="p-4 bg-muted/30 rounded-2xl w-fit mx-auto mb-6 animate-bounce-gentle">
                      <Wallet className="h-16 w-16 mx-auto opacity-50" />
                    </div>
                    <p className="text-lg font-medium">No transactions yet</p>
                    <p className="text-sm">Add your first transaction to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl border border-border/50 hover-lift transition-all duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl shadow-apple-sm ${
                            transaction.type === "income" ? "bg-income/10 border border-income/20" : "bg-expense/10 border border-expense/20"
                          }`}>
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-5 w-5 text-income" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-expense" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{transaction.description || transaction.category}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{transaction.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`text-xl font-bold tracking-tight ${
                          transaction.type === "income" ? "text-income" : "text-expense"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="animate-fade-in">
            <Card className="card-apple overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
                <CardTitle className="text-xl font-semibold">All Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground animate-fade-in">
                    <div className="p-4 bg-muted/30 rounded-2xl w-fit mx-auto mb-6">
                      <Wallet className="h-16 w-16 mx-auto opacity-50" />
                    </div>
                    <p className="text-lg font-medium">No transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-card to-muted/20 rounded-2xl border border-border/50 hover-lift transition-all duration-300"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`p-3 rounded-2xl shadow-apple-sm ${
                            transaction.type === "income" ? "bg-income/10 border border-income/20" : "bg-expense/10 border border-expense/20"
                          }`}>
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-5 w-5 text-income" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-expense" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{transaction.description || transaction.category}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <Badge variant="outline" className="rounded-lg">{transaction.category}</Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`text-xl font-bold tracking-tight ${
                          transaction.type === "income" ? "text-income" : "text-expense"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}