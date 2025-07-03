const ORDERS_STORAGE_KEY = 'voguevault_orders';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error reading orders from storage:', error);
    return [];
  }
};

const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to storage:', error);
  }
};

const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `VV${timestamp}${random}`.toUpperCase();
};

export const orderService = {
  async createOrder(orderData) {
    await delay(500);
    
    const orders = getOrdersFromStorage();
    const orderId = generateOrderId();
    
    const newOrder = {
      Id: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    orders.push(newOrder);
    saveOrdersToStorage(orders);
    
    return newOrder;
  },

  async getOrderById(orderId) {
    await delay(300);
    const orders = getOrdersFromStorage();
    const order = orders.find(o => o.Id === orderId);
    
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    
    return { ...order };
  },

  async getAllOrders() {
    await delay(300);
    const orders = getOrdersFromStorage();
    return [...orders];
  }
};