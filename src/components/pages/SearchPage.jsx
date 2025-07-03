import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilters from '@/components/molecules/ProductFilters';
import SearchBar from '@/components/molecules/SearchBar';
import { productService } from '@/services/api/productService';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: 'all',
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
      
      const productData = await productService.search(searchQuery, filters);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      sortBy: '',
      minPrice: '',
      maxPrice: '',
      colors: [],
      sizes: [],
      inStock: false
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Products'}
            </h1>
            <div className="max-w-md mx-auto">
              <SearchBar 
                className="w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
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
        {!loading && !error && (
          <div className="mb-6 text-sm text-gray-600">
            {searchQuery ? (
              <>Found {products.length} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"</>
            ) : (
              <>Showing {products.length} product{products.length !== 1 ? 's' : ''}</>
            )}
          </div>
        )}
        
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={loadProducts}
          emptyType="search"
        />
      </div>
    </div>
  );
};

export default SearchPage;