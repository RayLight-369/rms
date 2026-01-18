import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, CreditCard, Printer, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Order } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function WaiterBilling() {
  const { orders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);

  const readyOrders = orders.filter((o) => o.status === 'Ready' || o.status === 'In Progress');

  const handleOpenBilling = (order: Order) => {
    setSelectedOrder(order);
    setBillingDialogOpen(true);
  };

  const handlePrint = () => {
    toast.success('Receipt Printed', {
      description: 'Receipt sent to printer',
    });
  };

  const handleMarkPaid = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, 'Served');
      toast.success('Order Completed', {
        description: `Table ${selectedOrder.table_no} marked as paid`,
      });
      setBillingDialogOpen(false);
    }
  };

  const taxRate = 0.08;

  return (
    <DashboardLayout requiredRole="waiter">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>
          <p className="text-muted-foreground">Generate bills for completed orders</p>
        </div>

        {/* Orders Grid */}
        {readyOrders.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border">
            <div className="text-center">
              <Receipt className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No orders ready for billing</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {readyOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'rounded-xl border bg-card p-5 shadow-sm',
                  order.status === 'Ready' ? 'border-success/30' : 'border-border'
                )}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">Table {order.table_no}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items · {order.waiter_name}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mb-4 space-y-1.5">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-lg font-semibold text-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                  <Button
                    variant={order.status === 'Ready' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenBilling(order)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Generate Bill
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Billing Dialog */}
        <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bill for Table {selectedOrder?.table_no}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                {/* Receipt */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-4 border-b border-dashed border-border pb-4 text-center">
                    <p className="text-lg font-semibold text-foreground">RestaurantOS</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()} · {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="mb-4 space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 border-t border-dashed border-border pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        ${(selectedOrder.total / (1 + taxRate)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="text-foreground">
                        ${(selectedOrder.total - selectedOrder.total / (1 + taxRate)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                    Print Receipt
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleMarkPaid}>
                    <Check className="h-4 w-4" />
                    Mark as Paid
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
