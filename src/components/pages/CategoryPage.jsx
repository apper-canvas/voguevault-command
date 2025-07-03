import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilters from '@/components/molecules/ProductFilters';
import { productService } from '@/services/api/productService';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: category || 'all',
    sortBy: '',
    minPrice: '',
    maxPrice: '',
    colors: [],
    sizes: [],
    inStock: false
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = { ...filters };
      if (category && category !== 'all') {
        searchFilters.category = category;
      }
      
      const productData = await productService.search('', searchFilters);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: category || 'all' }));
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [filters, category]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: category || 'all',
      sortBy: '',
      minPrice: '',
      maxPrice: '',
      colors: [],
      sizes: [],
      inStock: false
    });
  };

  const getCategoryTitle = () => {
    if (!category || category === 'all') return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {getCategoryTitle()}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our curated collection of premium fashion pieces
          </p>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {!loading && !error && products.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
        )}
        
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={loadProducts}
          emptyType="category"
        />
      </div>
    </div>
  );
};

export default CategoryPage;