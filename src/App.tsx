import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";

// Waiter pages
import WaiterTables from "./pages/waiter/WaiterTables";
import WaiterOrders from "./pages/waiter/WaiterOrders";
import WaiterBilling from "./pages/waiter/WaiterBilling";

// Chef pages
import ChefKitchen from "./pages/chef/ChefKitchen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/inventory" element={<InventoryManagement />} />
            
            {/* Waiter Routes */}
            <Route path="/waiter" element={<WaiterTables />} />
            <Route path="/waiter/orders" element={<WaiterOrders />} />
            <Route path="/waiter/billing" element={<WaiterBilling />} />
            
            {/* Chef Routes */}
            <Route path="/chef" element={<ChefKitchen />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
