import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Check, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

function getTimeSince(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

const statusFlow: OrderStatus[] = ['Pending', 'In Progress', 'Ready'];

export default function ChefKitchen() {
  const { orders, updateOrderStatus } = useApp();

  const activeOrders = orders.filter((o) => o.status !== 'Served');

  const handleAdvanceStatus = (order: Order) => {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1];
      updateOrderStatus(order.id, newStatus);
      toast.success(`Order Updated`, {
        description: `Table ${order.table_no} → ${newStatus}`,
      });
    }
  };

  const pendingOrders = activeOrders.filter((o) => o.status === 'Pending');
  const inProgressOrders = activeOrders.filter((o) => o.status === 'In Progress');
  const readyOrders = activeOrders.filter((o) => o.status === 'Ready');

  const renderColumn = (title: string, items: Order[], colorClass: string, icon: React.ReactNode) => (
    <div className="flex-1">
      <div className={cn('mb-4 flex items-center gap-2 rounded-lg px-3 py-2', colorClass)}>
        {icon}
        <h2 className="font-semibold">{title}</h2>
        <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs font-medium">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">Table {order.table_no}</p>
                  <p className="text-xs text-muted-foreground">{order.waiter_name}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={order.status} />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {getTimeSince(order.created_at)}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4 space-y-1.5">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                      {item.quantity}
                    </span>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              {order.status !== 'Ready' && (
                <Button
                  variant={order.status === 'Pending' ? 'outline' : 'default'}
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleAdvanceStatus(order)}
                >
                  {order.status === 'Pending' ? (
                    <>
                      <ChefHat className="h-4 w-4" />
                      Start Preparing
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Mark Ready
                    </>
                  )}
                </Button>
              )}
              {order.status === 'Ready' && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 py-2 text-sm font-medium text-success">
                  <Check className="h-4 w-4" />
                  Ready for Pickup
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No orders</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout requiredRole="chef">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Kitchen Display
            </h1>
            <p className="text-muted-foreground">
              {activeOrders.length} active orders
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Pending</span>
            <ArrowRight className="h-4 w-4" />
            <span>In Progress</span>
            <ArrowRight className="h-4 w-4" />
            <span>Ready</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {renderColumn(
            'Pending',
            pendingOrders,
            'bg-warning/10 text-warning',
            <Clock className="h-4 w-4" />
          )}
          {renderColumn(
            'In Progress',
            inProgressOrders,
            'bg-info/10 text-info',
            <ChefHat className="h-4 w-4" />
          )}
          {renderColumn(
            'Ready',
            readyOrders,
            'bg-success/10 text-success',
            <Check className="h-4 w-4" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
