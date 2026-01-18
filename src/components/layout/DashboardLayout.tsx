import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { useApp, UserRole } from '@/context/AppContext';
import { Toaster } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { userRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) {
      navigate('/');
    } else if (userRole !== requiredRole) {
      navigate(`/${userRole}`);
    }
  }, [userRole, requiredRole, navigate]);

  if (!userRole || userRole !== requiredRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
