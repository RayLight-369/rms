import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Order,
  OrderItem,
  OrderStatus,
  MenuItem,
  InventoryItem,
  Table,
  initialOrders,
  menuItems as initialMenuItems,
  inventoryItems as initialInventoryItems,
  tables as initialTables,
} from '@/data/mockData';

export type UserRole = 'admin' | 'waiter' | 'chef' | null;

interface AppContextType {
  // Auth
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Inventory
  inventoryItems: InventoryItem[];
  updateInventoryItem: (id: string, quantity: number) => void;
  
  // Tables
  tables: Table[];
  updateTableStatus: (tableId: number, status: 'available' | 'occupied', orderId?: string) => void;
  
  // Cart (for waiter)
  cart: OrderItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName] = useState('Staff Member');
  
  // Data state
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [tables, setTables] = useState<Table[]>(initialTables);
  
  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  
  // Order functions
  const addOrder = (order: Omit<Order, 'id' | 'created_at'>) => {
    const newOrder: Order = {
      ...order,
      id: `ord${Date.now()}`,
      created_at: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Update table status
    if (order.table_no) {
      updateTableStatus(order.table_no, 'occupied', newOrder.id);
    }
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    // If served, free up the table
    if (status === 'Served') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        updateTableStatus(order.table_no, 'available');
      }
    }
  };
  
  // Menu functions
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu${Date.now()}`,
    };
    setMenuItems(prev => [...prev, newItem]);
  };
  
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };
  
  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Inventory functions
  const updateInventoryItem = (id: string, quantity: number) => {
    setInventoryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };
  
  // Table functions
  const updateTableStatus = (tableId: number, status: 'available' | 'occupied', orderId?: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? { ...table, status, currentOrderId: orderId }
          : table
      )
    );
  };
  
  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItemId === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.menuItemId === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
    });
  };
  
  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };
  
  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    setSelectedTable(null);
  };
  
  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        userName,
        orders,
        addOrder,
        updateOrderStatus,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        inventoryItems,
        updateInventoryItem,
        tables,
        updateTableStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        selectedTable,
        setSelectedTable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
