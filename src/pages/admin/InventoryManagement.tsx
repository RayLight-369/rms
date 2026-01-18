import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Package } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/data/mockData';

export default function InventoryManagement() {
  const { inventoryItems, updateInventoryItem } = useApp();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState('');

  const filteredItems = inventoryItems.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventoryItems.filter((i) => i.quantity < i.min_level).length;

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewQuantity(item.quantity.toString());
    setDialogOpen(true);
  };

  const handleUpdateQuantity = () => {
    if (editingItem) {
      const quantity = parseInt(newQuantity);
      if (isNaN(quantity) || quantity < 0) {
        toast.error('Please enter a valid quantity');
        return;
      }
      updateInventoryItem(editingItem.id, quantity);
      toast.success('Stock Updated', {
        description: `${editingItem.item_name} quantity updated to ${quantity} ${editingItem.unit}`,
      });
      setDialogOpen(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">Track and manage stock levels</p>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                {lowStockCount} item{lowStockCount > 1 ? 's' : ''} low on stock
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Minimum Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item, index) => {
                  const isLowStock = item.quantity < item.min_level;
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        'transition-colors',
                        isLowStock ? 'bg-destructive/5' : 'hover:bg-muted/50'
                      )}
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg',
                              isLowStock ? 'bg-destructive/10' : 'bg-muted'
                            )}
                          >
                            <Package
                              className={cn(
                                'h-4 w-4',
                                isLowStock ? 'text-destructive' : 'text-muted-foreground'
                              )}
                            />
                          </div>
                          <span className="font-medium text-foreground">{item.item_name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            'font-semibold',
                            isLowStock ? 'text-destructive' : 'text-foreground'
                          )}
                        >
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {item.min_level} {item.unit}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                        >
                          Update Stock
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock Level</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4 py-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-medium text-foreground">{editingItem.item_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    New Quantity ({editingItem.unit})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum required: {editingItem.min_level} {editingItem.unit}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuantity}>Update Stock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
