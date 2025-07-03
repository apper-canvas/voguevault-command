import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  type = 'products', 
  title, 
  message, 
  actionText = "Start Shopping",
  actionLink = "/"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'cart':
        return {
          icon: 'ShoppingBag',
          title: 'Your cart is empty',
          message: 'Discover our latest fashion collections and add some style to your wardrobe.',
          actionText: 'Continue Shopping',
          actionLink: '/'
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No products found',
          message: 'Try adjusting your search terms or browse our categories to find what you\'re looking for.',
          actionText: 'Browse Categories',
          actionLink: '/'
        };
      case 'category':
        return {
          icon: 'Package',
          title: 'No products in this category',
          message: 'This category is currently empty. Check back soon for new arrivals!',
          actionText: 'Explore Other Categories',
          actionLink: '/'
        };
      default:
        return {
          icon: 'Package',
          title: title || 'No products available',
          message: message || 'Check back soon for new arrivals and exciting fashion pieces.',
          actionText,
          actionLink
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="bg-gradient-to-br from-surface to-gray-100 rounded-full p-6 mb-6">
        <ApperIcon name={content.icon} size={64} className="text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-display text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.message}
      </p>
      
      <Link
        to={content.actionLink}
        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-accent transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium"
      >
        <ApperIcon name="ArrowRight" size={18} />
        {content.actionText}
      </Link>
    </div>
  );
};

export default Empty;