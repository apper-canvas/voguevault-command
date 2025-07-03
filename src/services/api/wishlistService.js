const WISHLIST_STORAGE_KEY = 'voguevault_wishlist';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading wishlist from storage:', error);
    return [];
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

export const wishlistService = {
  async getAll() {
    await delay(200);
    return getWishlistFromStorage();
  },

  async add(productId) {
    await delay(250);
    const wishlist = getWishlistFromStorage();
    
    // Check if item already exists
    const existingItemIndex = wishlist.findIndex(item => item.productId === productId);

    if (existingItemIndex === -1) {
      // Add new item
      const newItem = {
        productId,
        addedAt: new Date().toISOString()
      };
      wishlist.push(newItem);
      saveWishlistToStorage(wishlist);
    }

    return wishlist;
  },

  async remove(productId) {
    await delay(200);
    const wishlist = getWishlistFromStorage();
    
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    saveWishlistToStorage(updatedWishlist);
    return updatedWishlist;
  },

  async clear() {
    await delay(200);
    saveWishlistToStorage([]);
    return [];
  },

  async isInWishlist(productId) {
    await delay(100);
    const wishlist = getWishlistFromStorage();
    return wishlist.some(item => item.productId === productId);
  },

  async getWishlistItemCount() {
    await delay(100);
    const wishlist = getWishlistFromStorage();
    return wishlist.length;
  }
};