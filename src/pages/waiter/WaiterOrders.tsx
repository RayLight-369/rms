import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | 'appetizer' | 'main' | 'drink' | 'dessert';

export default function WaiterOrders() {
  const {
    menuItems,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    selectedTable,
    setSelectedTable,
    addOrder,
  } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryFilter>('all');

  const activeMenuItems = menuItems.filter((item) => item.is_active);

  const filteredItems = useMemo(() => {
    if (category === 'all') return activeMenuItems;
    return activeMenuItems.filter((item) => item.category === category);
  }, [activeMenuItems, category]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08;
  const tax = cartTotal * taxRate;
  const grandTotal = cartTotal + tax;

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      toast.error('Please select a table first');
      navigate('/waiter');
      return;
    }
    if (cart.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    addOrder({
      table_no: selectedTable,
      waiter_name: 'Staff',
      status: 'Pending',
      items: cart,
      total: grandTotal,
    });

    toast.success('Order Sent to Kitchen', {
      description: `Table ${selectedTable} · ${cart.length} items · $${grandTotal.toFixed(2)}`,
    });

    clearCart();
    navigate('/waiter');
  };

  const handleBackToTables = () => {
    setSelectedTable(null);
    navigate('/waiter');
  };

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'appetizer', label: 'Appetizers' },
    { id: 'main', label: 'Main Course' },
    { id: 'drink', label: 'Drinks' },
    { id: 'dessert', label: 'Desserts' },
  ];

  return (
    <DashboardLayout requiredRole="waiter">
      <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row lg:gap-6">
        {/* Left: Menu Items */}
        <div className="flex-1 overflow-hidden lg:overflow-auto">
          {/* Header */}
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToTables}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {selectedTable ? `Table ${selectedTable}` : 'New Order'}
              </h1>
              <p className="text-sm text-muted-foreground">Select items to add</p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => {
              const inCart = cart.find((c) => c.menuItemId === item.id);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(item)}
                  className={cn(
                    'relative flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                    inCart
                      ? 'border-primary bg-primary-light'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  )}
                >
                  {inCart && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {inCart.quantity}
                    </span>
                  )}
                  <p className="mb-1 text-sm font-medium text-foreground">{item.name}</p>
                  {item.description && (
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-auto text-sm font-semibold text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex w-full flex-col rounded-xl border border-border bg-card lg:w-96"
        >
          <div className="border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Order Summary</h2>
            <p className="text-sm text-muted-foreground">{cart.length} items</p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No items added yet</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.menuItemId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.menuItemId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.menuItemId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.menuItemId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Totals & Action */}
          <div className="border-t border-border p-4">
            <div className="mb-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
            >
              <Send className="h-4 w-4" />
              Send to Kitchen
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
