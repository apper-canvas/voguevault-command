import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orderService';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [errors, setErrors] = useState({});

  const total = getCartTotal();
  const shipping = total > 200 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/');
      toast.info('Your cart is empty. Please add items before checkout.');
    }
  }, [cartItems, cartLoading, navigate]);

  const validateShipping = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    
    required.forEach(field => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (!paymentInfo.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!paymentInfo.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }

    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep(2);
    }
  };

const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
          productName: item.product?.name || 'Unknown Product'
        })),
        shipping: shippingInfo,
        payment: {
          ...paymentInfo,
          cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4)
        },
        subtotal: total,
        shippingCost: shipping,
        tax: tax,
        total: finalTotal
      };

      const order = await orderService.createOrder(orderData);
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.Id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentInfo(prev => ({ ...prev, expiryDate: value }));
  };

  if (cartLoading) {
    return <Loading type="checkout" />;
  }

  if (cartItems.length === 0) {
    return <Empty type="cart" />;
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Confirmation', icon: 'Check' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center space-x-2 ${
                    currentStep >= step.number ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <ApperIcon name="Check" size={16} />
                    ) : (
                      <ApperIcon name={step.icon} size={16} />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-6 shadow-card"
                >
                  <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        error={errors.lastName}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                        required
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                        error={errors.phone}
                      />
                    </div>

                    <Input
                      label="Address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      error={errors.address}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        error={errors.state}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        error={errors.zipCode}
                        required
                      />
                    </div>

                    <Select
                      label="Country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                      options={['United States', 'Canada', 'United Kingdom']}
                    />

                    <Button type="submit" variant="primary" size="large" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-6 shadow-card"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Payment Information</h2>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <ApperIcon name="ArrowLeft" size={20} />
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <Input
                      label="Cardholder Name"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                      error={errors.cardholderName}
                      required
                    />

                    <Input
                      label="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={handleCardNumberChange}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={paymentInfo.expiryDate}
                        onChange={handleExpiryChange}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                      <Input
                        label="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      loading={loading}
                      className="w-full"
                    >
                      Place Order
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-card h-fit">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex space-x-3">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg bg-surface"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product?.name}</h4>
                      <p className="text-xs text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {total < 200 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <p className="text-yellow-800">
                    Add {formatPrice(200 - total)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;