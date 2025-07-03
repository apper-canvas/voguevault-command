import { useState, useEffect } from 'react';
import { cartService } from '@/services/api/cartService';
import { productService } from '@/services/api/productService';
import { toast } from 'react-toastify';
export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(
        cartData.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return {
              ...item,
              product
            };
          } catch (err) {
            console.error(`Error loading product ${item.productId}:`, err);
            return item;
          }
        })
      );
      
      setCartItems(enrichedItems);
    } catch (err) {
      setError(err.message);
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size = '', color = '', price = 0) => {
    try {
      await cartService.addToCart(productId, quantity, size, color, price);
      await loadCart();
      toast.success('Item added to cart!');
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const updateCartItem = async (productId, size, color, updates) => {
    try {
      await cartService.updateCartItem(productId, size, color, updates);
      await loadCart();
    } catch (err) {
      toast.error('Failed to update cart item');
      console.error('Error updating cart item:', err);
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      await cartService.removeFromCart(productId, size, color);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error('Failed to clear cart');
      console.error('Error clearing cart:', err);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    refreshCart: loadCart
  };
};