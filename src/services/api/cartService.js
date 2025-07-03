const CART_STORAGE_KEY = 'voguevault_cart';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const cartService = {
  async getCart() {
    await delay(200);
    return getCartFromStorage();
  },

  async addToCart(productId, quantity = 1, size = '', color = '', price = 0) {
    await delay(250);
    const cart = getCartFromStorage();
    
    // Check if item already exists with same product, size, and color
    const existingItemIndex = cart.findIndex(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem = {
        productId,
        quantity,
        size,
        color,
        price,
        addedAt: new Date().toISOString()
      };
      cart.push(newItem);
    }

    saveCartToStorage(cart);
    return cart;
  },

  async updateCartItem(productId, size, color, updates) {
    await delay(200);
    const cart = getCartFromStorage();
    
    const itemIndex = cart.findIndex(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );

    if (itemIndex > -1) {
      cart[itemIndex] = { ...cart[itemIndex], ...updates };
      saveCartToStorage(cart);
    }

    return cart;
  },

  async removeFromCart(productId, size, color) {
    await delay(200);
    const cart = getCartFromStorage();
    
    const updatedCart = cart.filter(item => 
      !(item.productId === productId && item.size === size && item.color === color)
    );

    saveCartToStorage(updatedCart);
    return updatedCart;
  },

  async clearCart() {
    await delay(200);
    saveCartToStorage([]);
    return [];
  },

  async getCartItemCount() {
    await delay(100);
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  async getCartTotal() {
    await delay(100);
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};