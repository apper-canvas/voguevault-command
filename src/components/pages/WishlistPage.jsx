import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

const WishlistPage = () => {
  const { 
    wishlistItems, 
    loading, 
    error, 
    removeFromWishlist, 
    clearWishlist,
    refreshWishlist 
  } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (product) => {
    if (!product.inStock) return;
    
    // Use first available size and color for quick add
    const defaultSize = product.sizes?.[0] || '';
    const defaultColor = product.colors?.[0] || '';
    
    await addToCart(product.Id, 1, defaultSize, defaultColor, product.price);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return <Loading type="products" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={refreshWishlist} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-black mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            size="medium"
            onClick={clearWishlist}
            icon="Trash2"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <ApperIcon name="Heart" size={64} className="mx-auto text-gray-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link to="/search">
              <Button variant="primary" size="large" icon="Grid3X3">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Wishlist Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {wishlistItems.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-surface aspect-[3/4]">
                <Link to={`/product/${item.product.Id}`}>
                  <img
                    src={item.product.images?.[0] || ''}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 group-hover:scale-110"
                >
                  <ApperIcon name="X" size={16} className="text-gray-600" />
                </button>

                {/* Out of Stock Overlay */}
                {!item.product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium px-3 py-1 bg-black rounded">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Quick Add Button */}
                {item.product.inStock && (
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleAddToCart(item.product)}
                      className="w-full"
                      icon="ShoppingBag"
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <Link to={`/product/${item.product.Id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-black transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 capitalize">
                  {item.product.category}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-black">
                    {formatPrice(item.product.price)}
                  </span>
                  
                  {item.product.colors && item.product.colors.length > 0 && (
                    <div className="flex space-x-1">
                      {item.product.colors.slice(0, 3).map((color, index) => (
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
                      {item.product.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{item.product.colors.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WishlistPage;