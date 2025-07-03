import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.productId, item.size, item.color);
    } else {
      onUpdateQuantity(item.productId, item.size, item.color, { quantity: newQuantity });
    }
  };

  if (!item.product) {
    return (
      <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
        <div className="bg-surface rounded w-20 h-20 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-surface rounded h-4 w-3/4 animate-pulse"></div>
          <div className="bg-surface rounded h-4 w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-4 py-6 border-b border-gray-200 last:border-b-0"
    >
      {/* Product Image */}
      <Link to={`/product/${item.product.Id}`} className="flex-shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg bg-surface"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product.Id}`} className="hover:text-accent transition-colors">
          <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
        </Link>
        
        <div className="mt-1 space-y-1">
          {item.size && (
            <p className="text-sm text-gray-600">Size: {item.size}</p>
          )}
          {item.color && (
            <p className="text-sm text-gray-600">Color: {item.color}</p>
          )}
          <p className="font-semibold text-black">{formatPrice(item.price)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3 mt-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Minus" size={14} />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.productId, item.size, item.color)}
            className="text-accent hover:text-red-700 transition-colors p-1"
            title="Remove item"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="font-semibold text-black">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </motion.div>
  );
};

export default CartItem;