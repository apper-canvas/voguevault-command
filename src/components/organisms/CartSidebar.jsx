import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/molecules/CartItem';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useCart } from '@/hooks/useCart';

const CartSidebar = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    loading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    getCartTotal,
    getCartItemCount 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const total = getCartTotal();
  const itemCount = getCartItemCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-display font-semibold">
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading cart...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <ApperIcon name="AlertTriangle" size={48} className="text-accent mx-auto mb-2" />
                    <p className="text-gray-600">{error}</p>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="bg-surface rounded-full p-6 mx-auto mb-4 w-fit">
                      <ApperIcon name="ShoppingBag" size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                    <Button
                      variant="primary"
                      onClick={onClose}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <CartItem
                          key={`${item.productId}-${item.size}-${item.color}`}
                          item={item}
                          onUpdateQuantity={updateCartItem}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-6 space-y-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Link to="/checkout" onClick={onClose}>
                        <Button variant="primary" className="w-full">
                          Checkout
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;