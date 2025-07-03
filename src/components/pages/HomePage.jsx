import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/organisms/ProductGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services/api/productService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getFeatured();
      setFeaturedProducts(products);
    } catch (err) {
      setError(err.message);
      console.error('Error loading featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      href: '/category/women'
    },
    {
      name: 'Men',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      href: '/category/men'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
      href: '/category/accessories'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop)'
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Luxury Fashion
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Discover timeless elegance and contemporary style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="large"
                icon="ArrowRight"
                iconPosition="right"
                className="transform hover:scale-105"
              >
                <Link to="/category/women">Shop Women</Link>
              </Button>
              <Button
                variant="secondary"
                size="large"
                icon="Users"
                className="transform hover:scale-105"
              >
                <Link to="/category/men">Shop Men</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collections designed for every style and occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={category.href}>
                  <div className="relative overflow-hidden rounded-lg bg-surface aspect-[3/4] shadow-card hover:shadow-card-hover transition-all duration-300">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-display text-3xl font-bold text-white mb-3">
                        {category.name}
                      </h3>
                      <Button
                        variant="secondary"
                        size="medium"
                        icon="ArrowRight"
                        iconPosition="right"
                        className="transform group-hover:scale-105 transition-transform"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-surface to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked selections from our latest collections
            </p>
          </motion.div>

          <ProductGrid
            products={featuredProducts}
            loading={loading}
            error={error}
            onRetry={loadFeaturedProducts}
            emptyType="products"
          />

          {!loading && !error && featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/search">
                <Button
                  variant="outline"
                  size="large"
                  icon="Grid3X3"
                  className="transform hover:scale-105"
                >
                  View All Products
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Truck',
                title: 'Free Shipping',
                description: 'Free worldwide shipping on orders over $200'
              },
              {
                icon: 'RotateCcw',
                title: 'Easy Returns',
                description: '30-day return policy for all purchases'
              },
              {
                icon: 'Shield',
                title: 'Secure Payment',
                description: 'Your payment information is safe and secure'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-accent transition-colors duration-300">
                  <ApperIcon name={feature.icon} size={32} className="mx-auto"><ApperIcon name={feature.icon} size={32} className="mx-auto" /></ApperIcon>
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;