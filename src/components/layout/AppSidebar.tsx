import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  ClipboardList,
  CreditCard,
  ChefHat,
  LogOut,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const adminNav: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { title: 'Menu Management', icon: UtensilsCrossed, path: '/admin/menu' },
  { title: 'Inventory', icon: Package, path: '/admin/inventory' },
];

const waiterNav: NavItem[] = [
  { title: 'Tables', icon: Users, path: '/waiter' },
  { title: 'Orders', icon: ClipboardList, path: '/waiter/orders' },
  { title: 'Billing', icon: CreditCard, path: '/waiter/billing' },
];

const chefNav: NavItem[] = [
  { title: 'Kitchen Display', icon: ChefHat, path: '/chef' },
];

export function AppSidebar() {
  const { userRole, setUserRole, userName } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = userRole === 'admin' 
    ? adminNav 
    : userRole === 'waiter' 
    ? waiterNav 
    : chefNav;

  const roleLabel = userRole === 'admin' 
    ? 'Administrator' 
    : userRole === 'waiter' 
    ? 'Waiter' 
    : 'Chef';

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">RestaurantOS</h1>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.title}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium text-muted-foreground">
                {userName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
