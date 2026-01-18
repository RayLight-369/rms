// Menu Items
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'appetizer' | 'main' | 'drink' | 'dessert';
  is_active: boolean;
  description?: string;
}

export const menuItems: MenuItem[] = [
  // Appetizers
  { id: 'a1', name: 'Bruschetta', price: 8.99, category: 'appetizer', is_active: true, description: 'Toasted bread with tomato & basil' },
  { id: 'a2', name: 'Caesar Salad', price: 10.99, category: 'appetizer', is_active: true, description: 'Fresh romaine with parmesan' },
  { id: 'a3', name: 'Soup of the Day', price: 6.99, category: 'appetizer', is_active: true, description: 'Ask your server' },
  { id: 'a4', name: 'Garlic Bread', price: 5.99, category: 'appetizer', is_active: true, description: 'With herb butter' },
  { id: 'a5', name: 'Caprese Salad', price: 11.99, category: 'appetizer', is_active: false, description: 'Mozzarella, tomato, basil' },
  
  // Main Courses
  { id: 'm1', name: 'Grilled Salmon', price: 24.99, category: 'main', is_active: true, description: 'With seasonal vegetables' },
  { id: 'm2', name: 'Ribeye Steak', price: 32.99, category: 'main', is_active: true, description: '12oz prime cut' },
  { id: 'm3', name: 'Chicken Parmesan', price: 18.99, category: 'main', is_active: true, description: 'With pasta marinara' },
  { id: 'm4', name: 'Mushroom Risotto', price: 16.99, category: 'main', is_active: true, description: 'Creamy arborio rice' },
  { id: 'm5', name: 'Fish & Chips', price: 15.99, category: 'main', is_active: true, description: 'Beer-battered cod' },
  { id: 'm6', name: 'Lamb Chops', price: 28.99, category: 'main', is_active: true, description: 'With mint sauce' },
  
  // Drinks
  { id: 'd1', name: 'Sparkling Water', price: 3.99, category: 'drink', is_active: true },
  { id: 'd2', name: 'Fresh Orange Juice', price: 4.99, category: 'drink', is_active: true },
  { id: 'd3', name: 'Espresso', price: 3.49, category: 'drink', is_active: true },
  { id: 'd4', name: 'Cappuccino', price: 4.49, category: 'drink', is_active: true },
  { id: 'd5', name: 'House Red Wine', price: 8.99, category: 'drink', is_active: true },
  { id: 'd6', name: 'House White Wine', price: 8.99, category: 'drink', is_active: true },
  
  // Desserts
  { id: 'de1', name: 'Tiramisu', price: 8.99, category: 'dessert', is_active: true },
  { id: 'de2', name: 'Chocolate Cake', price: 7.99, category: 'dessert', is_active: true },
  { id: 'de3', name: 'Crème Brûlée', price: 9.99, category: 'dessert', is_active: true },
];

// Orders
export type OrderStatus = 'Pending' | 'In Progress' | 'Ready' | 'Served';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  table_no: number;
  waiter_name: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: Date;
  total: number;
}

export const initialOrders: Order[] = [
  {
    id: 'ord1',
    table_no: 3,
    waiter_name: 'Sarah',
    status: 'Pending',
    items: [
      { menuItemId: 'a1', name: 'Bruschetta', quantity: 2, price: 8.99 },
      { menuItemId: 'm1', name: 'Grilled Salmon', quantity: 1, price: 24.99 },
      { menuItemId: 'd4', name: 'Cappuccino', quantity: 2, price: 4.49 },
    ],
    created_at: new Date(Date.now() - 15 * 60000),
    total: 51.95,
  },
  {
    id: 'ord2',
    table_no: 7,
    waiter_name: 'Mike',
    status: 'In Progress',
    items: [
      { menuItemId: 'm2', name: 'Ribeye Steak', quantity: 2, price: 32.99 },
      { menuItemId: 'a2', name: 'Caesar Salad', quantity: 1, price: 10.99 },
      { menuItemId: 'd5', name: 'House Red Wine', quantity: 2, price: 8.99 },
    ],
    created_at: new Date(Date.now() - 25 * 60000),
    total: 94.95,
  },
  {
    id: 'ord3',
    table_no: 1,
    waiter_name: 'Sarah',
    status: 'Ready',
    items: [
      { menuItemId: 'm4', name: 'Mushroom Risotto', quantity: 1, price: 16.99 },
      { menuItemId: 'd1', name: 'Sparkling Water', quantity: 2, price: 3.99 },
    ],
    created_at: new Date(Date.now() - 35 * 60000),
    total: 24.97,
  },
];

// Inventory
export interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  min_level: number;
}

export const inventoryItems: InventoryItem[] = [
  { id: 'inv1', item_name: 'Salmon Fillet', quantity: 12, unit: 'kg', min_level: 5 },
  { id: 'inv2', item_name: 'Ribeye Steak', quantity: 8, unit: 'kg', min_level: 10 },
  { id: 'inv3', item_name: 'Chicken Breast', quantity: 15, unit: 'kg', min_level: 8 },
  { id: 'inv4', item_name: 'Arborio Rice', quantity: 3, unit: 'kg', min_level: 5 },
  { id: 'inv5', item_name: 'Olive Oil', quantity: 8, unit: 'liters', min_level: 3 },
  { id: 'inv6', item_name: 'Parmesan Cheese', quantity: 2, unit: 'kg', min_level: 3 },
  { id: 'inv7', item_name: 'Fresh Tomatoes', quantity: 4, unit: 'kg', min_level: 6 },
  { id: 'inv8', item_name: 'Espresso Beans', quantity: 5, unit: 'kg', min_level: 2 },
  { id: 'inv9', item_name: 'House Red Wine', quantity: 18, unit: 'bottles', min_level: 10 },
  { id: 'inv10', item_name: 'Lamb Chops', quantity: 6, unit: 'kg', min_level: 4 },
];

// Tables
export interface Table {
  id: number;
  seats: number;
  status: 'available' | 'occupied';
  currentOrderId?: string;
}

export const tables: Table[] = [
  { id: 1, seats: 2, status: 'occupied', currentOrderId: 'ord3' },
  { id: 2, seats: 4, status: 'available' },
  { id: 3, seats: 4, status: 'occupied', currentOrderId: 'ord1' },
  { id: 4, seats: 2, status: 'available' },
  { id: 5, seats: 6, status: 'available' },
  { id: 6, seats: 4, status: 'available' },
  { id: 7, seats: 4, status: 'occupied', currentOrderId: 'ord2' },
  { id: 8, seats: 8, status: 'available' },
  { id: 9, seats: 2, status: 'available' },
  { id: 10, seats: 6, status: 'available' },
  { id: 11, seats: 4, status: 'available' },
  { id: 12, seats: 2, status: 'available' },
];
