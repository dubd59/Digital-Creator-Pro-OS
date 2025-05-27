import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet,
  Plus,
  X,
  Edit,
  Trash2,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Tag
} from 'lucide-react';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'recurring';
}

export const FinancialTrackerSection: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'income',
      category: 'Course Sales',
      amount: 2500,
      date: '2025-03-15',
      description: 'Digital Marketing Course Bundle',
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Software',
      amount: 49.99,
      date: '2025-03-14',
      description: 'Adobe Creative Cloud',
      status: 'recurring'
    },
    {
      id: 3,
      type: 'income',
      category: 'Consulting',
      amount: 1500,
      date: '2025-03-13',
      description: 'Social Media Strategy Session',
      status: 'completed'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Advertising',
      amount: 300,
      date: '2025-03-12',
      description: 'Facebook Ads Campaign',
      status: 'pending'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    type: 'income',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'completed'
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      ...newTransaction
    };

    setTransactions([transaction, ...transactions]);
    setShowAddModal(false);
    setNewTransaction({
      type: 'income',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      status: 'completed'
    });
  };

  const handleEditTransaction = () => {
    if (!selectedTransaction) return;

    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id ? selectedTransaction : t
    ));
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'recurring':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Tracker</h1>
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
        >
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Income</p>
                <h4 className="text-2xl font-bold mt-1 text-green-600">${totalIncome.toFixed(2)}</h4>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>12% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <DollarSign size={20} className="text-green-500 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Expenses</p>
                <h4 className="text-2xl font-bold mt-1 text-red-600">${totalExpenses.toFixed(2)}</h4>
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>8% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
                <CreditCard size={20} className="text-red-500 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Net Income</p>
                <h4 className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toFixed(2)}
                </h4>
                <p className="text-xs text-blue-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>5% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Wallet size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <Button 
                variant="outline" 
                icon={<Filter size={16} />}
              >
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr 
                    key={transaction.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-neutral-400 mr-2" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <Tag size={16} className="text-neutral-400 mr-2" />
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {transaction.type === 'income' ? (
                          <ArrowUpRight size={16} className="text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500 mr-1" />
                        )}
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={14} />}
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Add Transaction</h2>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ 
                  ...newTransaction, 
                  type: e.target.value as 'income' | 'expense' 
                })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newTransaction.status}
                onChange={(e) => setNewTransaction({ 
                  ...newTransaction, 
                  status: e.target.value as 'completed' | 'pending' | 'recurring'
                })}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleAddTransaction}
              disabled={!newTransaction.category || !newTransaction.amount || !newTransaction.description}
            >
              Add Transaction
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Transaction</h2>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {selectedTransaction && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.type}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    type: e.target.value as 'income' | 'expense' 
                  })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.category}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    category: e.target.value 
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.amount}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    amount: parseFloat(e.target.value) 
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.date}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    date: e.target.value 
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.description}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    description: e.target.value 
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={selectedTransaction.status}
                  onChange={(e) => setSelectedTransaction({ 
                    ...selectedTransaction, 
                    status: e.target.value as 'completed' | 'pending' | 'recurring'
                  })}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleEditTransaction}
              disabled={!selectedTransaction?.category || !selectedTransaction?.amount || !selectedTransaction?.description}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};