import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { productService } from '@/services/api/productService';

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 1000 }
  });

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filterData = await productService.getFilters();
        setAvailableFilters(filterData);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    loadFilters();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'women', label: 'Women' },
    { value: 'men', label: 'Men' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(key, newValues);
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' ||
           filters.minPrice ||
           filters.maxPrice ||
           (filters.colors && filters.colors.length > 0) ||
           (filters.sizes && filters.sizes.length > 0) ||
           filters.inStock ||
           filters.sortBy;
  };

  return (
    <div className="bg-white">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? "X" : "Filter"}
          className="flex-1 mr-3"
        >
          Filters
        </Button>
        
        <Select
          value={filters.sortBy || ''}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          options={sortOptions}
          className="flex-1"
        />
      </div>

      {/* Desktop Filters Bar */}
      <div className="hidden lg:flex items-center justify-between p-4 border-b space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <Select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={categories}
            className="w-48"
          />
          
          <Select
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            options={sortOptions}
            className="w-48"
          />
        </div>

        <div className="flex items-center space-x-4">
          {hasActiveFilters() && (
            <Button variant="ghost" onClick={onClearFilters} size="small">
              Clear Filters
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            icon="Filter"
            size="small"
          >
            More Filters
          </Button>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
          >
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter (Mobile Only) */}
                <div className="lg:hidden">
                  <Select
                    label="Category"
                    value={filters.category || 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    options={categories}
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Colors</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableFilters.colors.map(color => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filters.colors || []).includes(color)}
                          onChange={() => handleMultiSelectChange('colors', color)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Sizes</label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {availableFilters.sizes.map(size => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filters.sizes || []).includes(size)}
                          onChange={() => handleMultiSelectChange('sizes', size)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={onClearFilters}
                  size="small"
                >
                  Clear All
                </Button>
                
                <Button
                  variant="primary"
                  onClick={() => setIsOpen(false)}
                  size="small"
                  className="lg:hidden"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;