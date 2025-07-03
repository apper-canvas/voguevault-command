import React from 'react'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import '@/index.css'
import Layout from '@/components/organisms/Layout'
import CheckoutPage from '@/components/pages/CheckoutPage'
import SearchPage from '@/components/pages/SearchPage'
import ProductDetailPage from '@/components/pages/ProductDetailPage'
import OrderConfirmationPage from '@/components/pages/OrderConfirmationPage'
import CategoryPage from '@/components/pages/CategoryPage'
import HomePage from '@/components/pages/HomePage'
import WishlistPage from '@/components/pages/WishlistPage'
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;