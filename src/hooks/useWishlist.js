import { useState, useEffect } from 'react';
import { wishlistService } from '@/services/api/wishlistService';
import { productService } from '@/services/api/productService';
import { toast } from 'react-toastify';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const wishlistData = await wishlistService.getAll();
      setWishlist(wishlistData);
      
      // Enrich wishlist items with product details
      const enrichedItems = await Promise.all(
        wishlistData.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return {
              ...item,
              product
            };
          } catch (err) {
            console.error(`Error loading product ${item.productId}:`, err);
            return item;
          }
        })
      );
      
      setWishlistItems(enrichedItems);
    } catch (err) {
      setError(err.message);
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await wishlistService.add(productId);
      await loadWishlist();
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error('Failed to add to wishlist');
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      await loadWishlist();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
      console.error('Error removing from wishlist:', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistService.clear();
      await loadWishlist();
      toast.success('Wishlist cleared');
    } catch (err) {
      toast.error('Failed to clear wishlist');
      console.error('Error clearing wishlist:', err);
    }
  };

  const getWishlistItemCount = () => {
    return wishlist.length;
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return {
    wishlist,
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistItemCount,
    refreshWishlist: loadWishlist
  };
};