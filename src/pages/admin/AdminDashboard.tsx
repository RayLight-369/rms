import { DollarSign, ClipboardList, AlertTriangle, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/shared/MetricCard';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { orders, inventoryItems } = useApp();

  const activeOrders = orders.filter(o => o.status !== 'Served');
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = inventoryItems.filter(i => i.quantity < i.min_level);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your restaurant operations</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Today's Sales"
            value={`$${totalSales.toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            delay={0}
          />
          <MetricCard
            title="Active Orders"
            value={activeOrders.length}
            icon={ClipboardList}
            variant="success"
            delay={0.1}
          />
          <MetricCard
            title="Low Stock Alerts"
            value={lowStockItems.length}
            icon={AlertTriangle}
            variant={lowStockItems.length > 0 ? 'warning' : 'default'}
            delay={0.2}
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${orders.length > 0 ? (totalSales / orders.length).toFixed(2) : '0.00'}`}
            icon={TrendingUp}
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Orders</h2>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <span className="text-sm font-semibold text-muted-foreground">
                        T{order.table_no}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Table {order.table_no}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} items · ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Low Stock Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground">Low Stock Alerts</h2>
            {lowStockItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">All items are well stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Min level: {item.min_level} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-destructive">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-destructive">Low stock</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
