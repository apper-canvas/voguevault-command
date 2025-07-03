import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { useCart } from '@/hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use first available size and color for quick add
    const defaultSize = product.sizes[0] || '';
    const defaultColor = product.colors[0] || '';
    
    await addToCart(product.Id, 1, defaultSize, defaultColor, product.price);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Product Image */}
          <div className="relative overflow-hidden bg-surface aspect-[3/4]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium px-3 py-1 bg-black rounded">
                  Out of Stock
                </span>
              </div>
            )}
            
            {/* Quick Add Button */}
            {product.inStock && (
              <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleQuickAdd}
                  className="w-full"
                >
                  Quick Add
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">
              {product.name}
            </h3>
            
            <p className="text-sm text-gray-600 capitalize">
              {product.category}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-black">
                {formatPrice(product.price)}
              </span>
              
              {product.colors && product.colors.length > 0 && (
                <div className="flex space-x-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#808080' :
                                       color.toLowerCase() === 'navy' ? '#000080' :
                                       color.toLowerCase() === 'burgundy' ? '#800020' :
                                       color.toLowerCase() === 'camel' ? '#C19A6B' :
                                       color.toLowerCase() === 'cream' ? '#FFFDD0' :
                                       color.toLowerCase() === 'tan' ? '#D2B48C' :
                                       color.toLowerCase() === 'brown' ? '#8B4513' :
                                       color.toLowerCase() === 'charcoal' ? '#36454F' :
                                       color.toLowerCase().includes('blue') ? '#0066CC' :
                                       color.toLowerCase().includes('green') ? '#228B22' :
                                       color.toLowerCase().includes('pink') ? '#FFC0CB' :
                                       '#CCCCCC'
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;