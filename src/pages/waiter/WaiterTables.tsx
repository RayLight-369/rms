import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function WaiterTables() {
  const { tables, setSelectedTable, clearCart } = useApp();
  const navigate = useNavigate();

  const handleSelectTable = (tableId: number) => {
    clearCart();
    setSelectedTable(tableId);
    navigate('/waiter/orders');
  };

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const availableCount = tables.filter((t) => t.status === 'available').length;

  return (
    <DashboardLayout requiredRole="waiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Table Selection
            </h1>
            <p className="text-muted-foreground">
              Select a table to start or view an order
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">
                Available ({availableCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">
                Occupied ({occupiedCount})
              </span>
            </div>
          </div>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {tables.map((table, index) => (
            <motion.button
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTable(table.id)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 p-4 transition-all',
                table.status === 'occupied'
                  ? 'border-primary bg-primary-light'
                  : 'border-dashed border-border bg-card hover:border-primary hover:bg-primary-light'
              )}
            >
              <div
                className={cn(
                  'mb-2 flex h-12 w-12 items-center justify-center rounded-full',
                  table.status === 'occupied'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <span className="text-lg font-bold">{table.id}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{table.seats} seats</span>
              </div>
              {table.status === 'occupied' && (
                <span className="mt-2 text-xs font-medium text-primary">In Use</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
