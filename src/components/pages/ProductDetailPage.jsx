import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { productService } from "@/services/api/productService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productService.getById(id);
      setProduct(productData);
      
      // Set default selections
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setAddingToCart(true);
    try {
      await addToCart(product.Id, quantity, selectedSize, selectedColor, product.price);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
};

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return <Loading type="product-detail" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message="Product not found" showRetry={false} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ApperIcon name="ChevronRight" size={16} />
        <Link to={`/category/${product.category}`} className="hover:text-black transition-colors capitalize">
          {product.category}
        </Link>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div 
            className="relative overflow-hidden rounded-lg bg-surface aspect-[3/4]"
            layoutId="main-image"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium px-4 py-2 bg-black rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </motion.div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg bg-surface aspect-square border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-black mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 capitalize text-lg">{product.category}</p>
          </div>

          <div className="text-3xl font-display font-bold text-black">
            {formatPrice(product.price)}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center border rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Minus" size={16} />
              </button>
              <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
              </button>
            </div>
          </div>

{/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                loading={addingToCart}
                icon="ShoppingBag"
                className="flex-1"
              >
                {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant={isWishlisted ? "secondary" : "outline"}
                size="large"
                onClick={handleWishlistToggle}
                icon="Heart"
                className={`px-6 ${
                  isWishlisted 
                    ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' 
                    : 'hover:text-red-600 hover:border-red-200'
                }`}
              >
                {isWishlisted ? 'Saved' : 'Save'}
              </Button>
            </div>

            {product.inStock && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Check" size={16} className="text-green-500" />
                <span>In stock and ready to ship</span>
              </div>
            )}
          </div>

          {/* Product Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <ApperIcon name="Truck" size={18} className="text-gray-400" />
              <span>Free shipping on orders over $200</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <ApperIcon name="RotateCcw" size={18} className="text-gray-400" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <ApperIcon name="Shield" size={18} className="text-gray-400" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;