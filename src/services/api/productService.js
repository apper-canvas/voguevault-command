import mockProducts from '@/services/mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...mockProducts];
  },

  async getById(id) {
    await delay(250);
    const product = mockProducts.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay(300);
    return mockProducts.filter(p => p.category === category).map(p => ({ ...p }));
  },

  async getFeatured() {
    await delay(250);
    return mockProducts.filter(p => p.featured).map(p => ({ ...p }));
  },

  async search(query, filters = {}) {
    await delay(300);
    let results = [...mockProducts];

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters.minPrice) {
      results = results.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      results = results.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.colors && filters.colors.length > 0) {
      results = results.filter(p => 
        p.colors.some(color => filters.colors.includes(color))
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      results = results.filter(p => 
        p.sizes.some(size => filters.sizes.includes(size))
      );
    }

    if (filters.inStock) {
      results = results.filter(p => p.inStock);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return results;
  },

  async getCategories() {
    await delay(200);
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories;
  },

  async getFilters() {
    await delay(200);
    const allColors = [...new Set(mockProducts.flatMap(p => p.colors))];
    const allSizes = [...new Set(mockProducts.flatMap(p => p.sizes))];
    const priceRange = {
      min: Math.min(...mockProducts.map(p => p.price)),
      max: Math.max(...mockProducts.map(p => p.price))
    };

    return {
      colors: allColors,
      sizes: allSizes,
      priceRange
    };
  }
};