import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, CreditCard, Tag, Percent, Phone, SquareCheck, Info, X, Calendar, Edit2, CheckCircle2, ShieldCheck, Lock, Smartphone, Building2, ChevronRight, CheckCircle, ChevronLeft, Sparkles, ArrowRight, ArrowLeft, Search, ShoppingCart, HelpCircle, Mail } from 'lucide-react';
import { formatOrderId } from '../utils/formatOrderId';
import { detectCurrentLocation } from '../utils/location';
import AuthModal from '../components/AuthModal';
import { useUI } from '../context/UIContext';

const Checkout = () => {
  const { cartItems: allCartItems, clearCart, clearCategoryFromCart, updateQuantity } = useCart();
  const { user, login, isAuthenticated, loading: authLoading } = useAuth();
  const { locationLabel } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  // Read which category this checkout is for
  const searchParams = new URLSearchParams(location.search);
  const checkoutCategory = searchParams.get('category');

  // Only show items for this category (or all if no category param)
  const cartItems = checkoutCategory
    ? allCartItems.filter(item => (item.category || 'other') === checkoutCategory)
    : allCartItems;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data States
  const [formData, setFormData] = useState({
    phone: user?.mobile || '',
    address: locationLabel || localStorage.getItem('dhoond_location') || ''
  });

  // Keep address in sync when location context updates
  useEffect(() => {
    if (!formData.address || formData.address === 'Fetching location…' || formData.address === 'Detecting…' || formData.address.includes('78, 25th Main Rd')) {
      if (locationLabel && locationLabel !== 'Fetching location…' && locationLabel !== 'Detecting…') {
        setFormData(prev => ({ ...prev, address: locationLabel }));
      }
    }
  }, [locationLabel]);

  // Keep phone in sync when user changes (e.g. after auth modal)
  useEffect(() => {
    if (user?.mobile && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: user.mobile }));
    }
  }, [user]);

  // Flow Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [arrivalPref, setArrivalPref] = React.useState('direct'); // 'call' | 'direct'
  const [arrivalNote, setArrivalNote] = React.useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Edit States
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Slot States
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');

  // Payment State
  const [status, setStatus] = useState('idle'); // idle, booking, payment, success
  const [selectedPayment, setSelectedPayment] = useState('upi'); // upi, card, netbanking
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [avoidCalling, setAvoidCalling] = useState(true);
  const [paymentError, setPaymentError] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [locating, setLocating] = useState(false);
  const [startOtp, setStartOtp] = useState('');

  const handleFetchLocation = async () => {
    setLocating(true);
    try {
      const loc = await detectCurrentLocation();
      setFormData(prev => ({ ...prev, address: loc.label }));
    } catch (err) {
      alert("Could not fetch location: " + err.message);
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    setIsInitializing(false);
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsAuthModalOpen(false);
    }

    // FB Pixel Tracking: InitiateCheckout
    if (window.fbq && isAuthenticated && cartItems.length > 0) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: cartItems.map(i => String(i.id)),
        contents: cartItems.map(i => ({ id: String(i.id), quantity: i.quantity })),
        content_type: 'product',
        value: Number(finalAmountToPay),
        currency: 'INR',
        num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0)
      });
    }
  }, [isAuthenticated, authLoading]);

  // Tip State
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTipping, setIsCustomTipping] = useState(false);

  // Dynamic Date Generation
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    let dayLabel = "";
    if (i === 0) dayLabel = "Today";
    else if (i === 1) dayLabel = "Tomorrow";
    else dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    dates.push({
      id: d.toDateString(),
      label: dayLabel,
      date: `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`,
      display: `${dayLabel}, ${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`
    });
  }

  // Dynamic Time Slots
  const allTimeSlots = [
    { label: 'Morning', time: '09:00 AM', hour: 9 },
    { label: 'Midday', time: '11:30 AM', hour: 11.5 },
    { label: 'Afternoon', time: '02:00 PM', hour: 14 },
    { label: 'Evening', time: '04:30 PM', hour: 16.5 },
    { label: 'Late', time: '07:00 PM', hour: 19 }
  ];

  const getAvailableSlots = (dateDisplay) => {
    if (!dateDisplay.startsWith("Today")) return allTimeSlots;
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    return allTimeSlots.filter(slot => slot.hour > (currentHour + 2)); // 2 hour buffer
  };

  // Financial Math
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.originalPrice || item.discountPrice || 0) * (item.quantity || 1)), 0);
  const totalDiscount = cartItems.reduce((acc, item) => acc + ((Number(item.originalPrice || item.discountPrice || 0) - Number(item.discountPrice || 0)) * (item.quantity || 1)), 0);
  const itemTotal = subtotal - totalDiscount;
  const total = itemTotal; // Alias for JSX consistency
  const inclusiveTax = total - (total / 1.18);
  const netPrice = total - inclusiveTax;
  const finalAmountToPay = total + tipAmount;

  // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{ padding: '5rem 5%', textAlign: 'center', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'rgba(37, 99, 235, 0.15)', borderRadius: '50%', filter: 'blur(15px)', animation: 'pulse 2s infinite' }}></div>
          <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 10px 30px rgba(37,99,235,0.3)' }}>
            <CheckCircle2 size={48} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, marginBottom: '0.75rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Booking Confirmed!</h2>
        <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>Great! Your professional arrives on <b style={{ color: '#0f172a' }}>{selectedDate}</b> at <b style={{ color: '#0f172a' }}>{selectedTime}</b>.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Booking ID</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.05em' }}>
              {formatOrderId(confirmedOrder?.id, confirmedOrder?.created_at, confirmedOrder?.daily_sequence)}
            </p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.3)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Service Start OTP</h3>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fef08a', margin: 0, letterSpacing: '0.3em', textShadow: '0 2px 10px rgba(254,240,138,0.2)' }}>{startOtp}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Share this with your professional at the door</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '1rem 2.5rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 8px 25px rgba(37,99,235,0.3)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,99,235,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.3)'; }}>Track Booking</button>
          <button onClick={() => navigate('/')} style={{ background: '#fff', color: '#0f172a', padding: '1rem 2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // ─── RAZORPAY CHECKOUT ─────────────────────────────────────────────────────
  const processFinalBooking = async (dhoondOrderId, paymentId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      console.log("[Checkout] Finalizing booking for Order:", dhoondOrderId, "Payment:", paymentId);

      // 1. Update Order Status to Confirmed
      await fetch(`${apiUrl}/api/V1/orders/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dhoondOrderId,
          status: 'Confirmed'
        })
      });

      // 2. Create Payment Record (Success)
      const paymentResponse = await fetch(`${apiUrl}/api/V1/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: dhoondOrderId,
          amount: finalAmountToPay,
          payment_method: selectedPayment,
          payment_status: 'success',
          transaction_id: paymentId
        })
      });

      const paymentResult = await paymentResponse.json();
      if (!paymentResult.success) {
        console.warn("[Checkout] Payment record failed but order exists:", paymentResult.message);
      }

      // 3. FB Pixel Tracking: Purchase (Track BEFORE clearing cart)
      if (window.fbq) {
        try {
          const purchaseParams = {
            content_ids: cartItems.map(i => String(i.id)),
            contents: cartItems.map(i => ({
              id: String(i.id),
              quantity: i.quantity,
              item_price: Number(i.discountPrice || 0)
            })),
            content_type: 'product',
            value: Number(finalAmountToPay),
            currency: 'INR',
            num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0),
            transaction_id: String(dhoondOrderId)
          };
          window.fbq('track', 'Purchase', purchaseParams);
          console.log("[FB Pixel] Purchase Tracked:", purchaseParams);
        } catch (fbErr) {
          console.error("[FB Pixel] Purchase Tracking Error:", fbErr);
        }
      }

      // 4. Update UI
      const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setStartOtp(mockOtp);
      setStatus('success');

      if (checkoutCategory) {
        clearCategoryFromCart(checkoutCategory);
      } else {
        clearCart();
      }

      console.log("[Checkout] Sync complete. Success screen triggered.");

    } catch (err) {
      console.error("[Checkout Finalization Error]", err);
      setPaymentError('Payment was successful but we couldn\'t update your order. Please contact support.');
      setStatus('idle');
    }
  };

  const handlePaymentCancellation = async (dhoondOrderId, reason = "Payment Cancelled") => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log("[Checkout] Handling Cancellation for Order:", dhoondOrderId, "Reason:", reason);

      // 1. Update Order to Cancelled
      await fetch(`${apiUrl}/api/V1/orders/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dhoondOrderId, status: 'Cancelled' })
      });

      // 2. Create Failed Payment Record
      await fetch(`${apiUrl}/api/V1/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: dhoondOrderId,
          amount: finalAmountToPay,
          payment_method: selectedPayment,
          payment_status: 'cancelled',
          transaction_id: `CANCELLED_${Date.now()}`
        })
      });

      setPaymentError(`Booking request cancelled. No amount was charged.`);
      setStatus('idle');
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error("[Cancellation Handler Error]", err);
      setStatus('idle');
    }
  };

  const openRazorpayCheckout = async () => {
    if (!window.Razorpay) {
      setPaymentError('Razorpay SDK failed to load. Please check your connection.');
      setStatus('idle');
      return;
    }

    if (total <= 0) {
      alert('Your cart is empty. Please add a service before proceeding.');
      return;
    }

    setStatus('booking'); // Show loading state
    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      // 1. Create Dhoond Order FIRST (Status: Pending)
      console.log("[Checkout] Creating Dhoond Order record...");
      const dhoondOrderRes = await fetch(`${apiUrl}/api/V1/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          address: formData.address,
          price: finalAmountToPay,
          platform_fee: 0,
          category_id: null,
          partner_id: null,
          items: cartItems.map(i => ({
            id: i.id,
            title: i.title,
            quantity: i.quantity,
            price: i.discountPrice
          }))
        })
      });
      const dhoondOrderData = await dhoondOrderRes.json();
      if (!dhoondOrderRes.ok || !dhoondOrderData.success) {
        throw new Error(dhoondOrderData.message || 'Failed to initiate order in system');
      }
      const dhoondOrderId = dhoondOrderData.data.id;
      setConfirmedOrder(dhoondOrderData.data);
      console.log("[Checkout] Dhoond Order Created (Pending):", dhoondOrderId);

      // 2. Create Razorpay Order
      console.log("[Checkout] Creating Razorpay matching order...");
      const orderRes = await fetch(`${apiUrl}/api/V1/payments/razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmountToPay }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      console.log("[Checkout] Razorpay Order ID:", orderData.order_id);

      // FB Pixel: AddPaymentInfo
      if (window.fbq) {
        try {
          const payInfoParams = {
            content_ids: cartItems.map(i => String(i.id)),
            content_type: 'product',
            value: Number(finalAmountToPay),
            currency: 'INR'
          };
          window.fbq('track', 'AddPaymentInfo', payInfoParams);
          console.log("[FB Pixel] AddPaymentInfo Tracked:", payInfoParams);
        } catch (fbErr) {
          console.error("[FB Pixel] AddPaymentInfo Tracking Error:", fbErr);
        }
      }

      // 3. Open Razorpay with both IDs
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(finalAmountToPay * 100),
        currency: "INR",
        name: "Dhoond.co",
        description: "Service Payment",
        image: "https://www.dhoond.co/favicon.png",
        order_id: orderData.order_id,
        handler: function (response) {
          processFinalBooking(dhoondOrderId, response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            handlePaymentCancellation(dhoondOrderId, "User closed the payment modal");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: String(user?.mobile || formData.phone).replace(/\D/g, '').slice(-10)
        },
        theme: {
          color: "#2563eb"
        },
        notes: {
          dhoond_order_id: String(dhoondOrderId),
          category: checkoutCategory || 'general'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("[Razorpay] Payment Failed Callback:", response.error);
        handlePaymentCancellation(dhoondOrderId, response.error.description || 'Payment failed at gateway');
      });
      rzp.open();
    } catch (err) {
      console.error("[Razorpay Initialization Error]", err);
      setPaymentError(err.message || "Could not initialize payment gateway.");
      setStatus('idle');
    }
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time slot first.');
      return;
    }

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setStatus('payment');
    setPaymentError('');
    console.log("Launching Razorpay for amount:", finalAmountToPay);

    setIsPaymentModalOpen(false);
    openRazorpayCheckout();
  };

  const handleApplyCustomTip = () => {
    const val = Number(customTip);
    if (val > 0) {
      setTipAmount(val);
      setIsCustomTipping(false);
    }
  };

  const handleConfirmSlot = () => {
    if (tempDate && tempTime) {
      setSelectedDate(tempDate);
      setSelectedTime(tempTime);
      setIsSlotModalOpen(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header & Styles */}
      <style>{`
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .checkout-card { background: #fff; border-radius: 16px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 4px 25px rgba(0,0,0,0.03); overflow: hidden; }
        .form-input { width: 100%; padding: 1rem 1.25rem; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 1rem; font-weight: 500; outline: none; transition: all 0.2s; background: #fafafa; }
        .form-input:focus { border-color: #0a57d0; background: #fff; box-shadow: 0 0 0 4px rgba(10,87,208,0.1); }
        .checkout-qty-btn { background: #f1f5f9; border: none; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; font-weight: 600; color: #475569; transition: all 0.2s; }
        .checkout-qty-btn:hover { background: #e2e8f0; color: #0f172a; }
        .badge-assured { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; background: #eff6ff; border: 1px solid #bae6fd; color: #1d4ed8; border-radius: 99px; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; }
        .outline-btn-dhoond { display: inline-flex; align-items: center; justify-content: center; border: 1px solid #0a57d0; color: #0a57d0; background: #fff; border-radius: 8px; padding: 0.5rem 1.5rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
        .outline-btn-dhoond:hover { background: #eff6ff; }
        .blue-info-banner { display: flex; align-items: center; gap: 0.5rem; color: #0a57d0; font-size: 0.85rem; font-weight: 500; background: #eff6ff; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #dbeafe; }
        .yellow-saving-banner { display: flex; align-items: center; gap: 0.5rem; color: #854d0e; font-weight: 600; font-size: 0.95rem; background: #fef9c3; padding: 0.75rem 1.25rem; border-radius: 12px; border: 1px solid #fef08a; }
        .assistance-section { background: #0f172a; color: #f8fafc; padding: 4rem 5% 3rem; text-align: center; }
        .assistance-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.5rem; width: 100%; max-width: 320px; transition: transform 0.2s; }
        .assistance-card:hover { transform: translateY(-2px); }
        .checkout-footer { background: #0b0f19; color: #94a3b8; padding: 4rem 5% 2rem; border-top: 1px solid #1e293b; }
        .checkout-footer-col { display: flex; flexDirection: column; gap: 0.75rem; }
        .checkout-footer-col h4 { color: #fff; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .checkout-footer-col a { color: #94a3b8; font-size: 0.9rem; transition: color 0.2s; text-decoration: none; }
        .checkout-footer-col a:hover { color: #facc15; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>



      {/* 2. Cobalt Blue Sub-header Bar */}
      <div style={{
        background: '#0A57D0',
        padding: '1.25rem 5%',
        color: '#fff'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Secure Checkout</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>Finish your booking in few simple steps</p>
          </div>
          <div className="hide-mobile" style={{ fontStyle: 'italic', fontSize: '0.85rem', fontWeight: 500, opacity: 0.9, letterSpacing: '0.05em' }}>
            India's Trusted Marketplace
          </div>
        </div>
      </div>

      {/* Payment Error Banner */}
      {paymentError && (
        <div style={{ maxWidth: '1100px', margin: '1.5rem auto 0', padding: '0 5%' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeIn 0.3s ease-out', boxShadow: '0 4px 15px rgba(239,68,68,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                <Info size={20} color="#dc2626" />
              </div>
              <span style={{ color: '#991b1b', fontWeight: 500, fontSize: '0.95rem' }}>{paymentError}</span>
            </div>
            <button onClick={() => setPaymentError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#dc2626' }}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="checkout-grid" style={{
        maxWidth: '1100px', margin: '2rem auto', padding: '0 5%', display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', gap: '2.5rem', alignItems: 'start',
        opacity: (!isAuthenticated || isInitializing) ? 0.4 : 1,
        pointerEvents: (!isAuthenticated || isInitializing) ? 'none' : 'auto',
        filter: (!isAuthenticated || isInitializing) ? 'blur(8px)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {(!isAuthenticated && !isInitializing) && (
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 50, textAlign: 'center', background: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '90%', maxWidth: '420px', animation: 'slideUp 0.4s ease-out' }}>
            <div style={{ background: '#eff6ff', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #dbeafe' }}>
              <Lock size={32} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Login Required</h3>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.5 }}>Please verify your phone number to view checkout details and proceed with booking.</p>
            <button onClick={() => setIsAuthModalOpen(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(15,23,42,0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>Verify Now</button>
          </div>
        )}

        {/* LEFT COLUMN: Service Cards (64% width on desktop, 100% on mobile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: isMobile ? '100%' : '64%' }}>
          
          {/* Painting Services Card */}
          <div className="checkout-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {checkoutCategory === 'painter' ? 'Painting Services' : 'Booking Details'}
              </h3>
              <span className="badge-assured">
                <ShieldCheck size={16} color="#0A57D0" fill="#eff6ff" /> Professional Assured
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Thumbnail Image */}
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0, background: '#f8fafc' }}>
                    <img src={item.image || "/favicon.png"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Title & Description */}
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 500, lineHeight: 1.3, marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
                      {item.title?.toLowerCase().includes('consultation') ? 'Specialized assessment & cost estimation' : 'Premium service warranty'}
                    </div>
                  </div>

                  {/* Quantity and Price Container */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between', minWidth: '180px' }}>
                    {/* Quantity Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '0.2rem', border: '1px solid #e2e8f0' }}>
                      <button className="checkout-qty-btn" onClick={() => updateQuantity(item.id, -1)} style={{ background: 'transparent' }}>−</button>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: '0.95rem', fontWeight: 500, color: '#0A57D0' }}>{item.quantity}</span>
                      <button
                        className="checkout-qty-btn"
                        style={{
                          cursor: item.title?.toLowerCase().includes('consultation') ? 'not-allowed' : 'pointer',
                          color: item.title?.toLowerCase().includes('consultation') ? '#cbd5e1' : '#475569',
                          background: 'transparent'
                        }}
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.title?.toLowerCase().includes('consultation')}
                      >+</button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', minWidth: '65px' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0A57D0' }}>₹{Number(item.discountPrice || 0).toFixed(0)}</div>
                      {item.originalPrice > item.discountPrice && (
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 400 }}>₹{Number(item.originalPrice || 0).toFixed(0)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expert arrival instruction */}
            <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Expert Arrival Preference</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'direct', label: 'Arrive directly', sub: "Don't call", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
                  { id: 'call', label: 'Call me first', sub: 'Before coming', icon: <Phone size={18} /> },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setArrivalPref(opt.id)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      padding: '0.85rem 0.5rem',
                      borderRadius: '14px',
                      border: arrivalPref === opt.id ? '2px solid #0a57d0' : '2px solid #f1f5f9',
                      background: arrivalPref === opt.id ? '#eff6ff' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: arrivalPref === opt.id ? '0 4px 15px rgba(10,87,208,0.1)' : 'none',
                      minWidth: '120px'
                    }}
                  >
                    <div style={{ color: arrivalPref === opt.id ? '#0a57d0' : '#64748b', display: 'flex', marginBottom: '2px' }}>
                      {opt.icon}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: arrivalPref === opt.id ? '#0a57d0' : '#475569' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.7rem', color: arrivalPref === opt.id ? '#3b82f6' : '#94a3b8', fontWeight: 400 }}>{opt.sub}</span>
                  </button>
                ))}
              </div>
              
              {arrivalPref === 'call' && (
                <div style={{ marginTop: '1.25rem', animation: 'fadeIn 0.2s' }}>
                  <input
                    type="tel"
                    value={arrivalNote}
                    onChange={e => setArrivalNote(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Best number to call (+91 XXXXX)"
                    className="form-input"
                  />
                </div>
              )}
              {arrivalPref === 'direct' && (
                <div className="blue-info-banner" style={{ marginTop: '1.25rem' }}>
                  <Info size={16} />
                  <span>Expert will head straight to your address</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Slot Card */}
          <div className="checkout-card" style={{ padding: '1.25rem 1.75rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A57D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                   <Calendar size={24} />
                 </div>
                 <div>
                   <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', marginBottom: '2px' }}>Service Slot</div>
                   <div style={{ fontSize: '0.9rem', color: selectedDate ? '#0A57D0' : '#64748b', fontWeight: selectedDate ? 500 : 400 }}>
                     {selectedDate ? `${selectedDate} at ${selectedTime}` : 'Please select a date & time'}
                   </div>
                 </div>
               </div>
               <button onClick={() => setIsSlotModalOpen(true)} className="outline-btn-dhoond">
                 {selectedDate ? 'Change' : 'Select'}
               </button>
             </div>
          </div>

          {/* Service Address Card */}
          <div className="checkout-card" style={{ padding: '1.75rem' }}>
            {isEditingAddress ? (
              <div style={{ width: '100%', animation: 'fadeIn 0.2s' }}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A57D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginRight: '1.25rem', flexShrink: 0 }}><MapPin size={24} /></div>
                   <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem' }}>Service Address</div>
                 </div>
                 <div style={{ width: '100%', height: '220px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                   <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '1rem', borderRadius: '50%', boxShadow: '0 10px 25px rgba(37,99,235,0.2)' }}><MapPin size={32} color="#0a57d0" /></div>
                   <button onClick={handleFetchLocation} style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{locating ? 'Locating...' : 'Use Current Location'}</button>
                 </div>
                 <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} className="form-input" style={{ resize: 'none' }} placeholder="Enter full address details" />
                 <button onClick={() => setIsEditingAddress(false)} style={{ width: '100%', background: '#0a57d0', color: '#fff', padding: '0.9rem', borderRadius: '10px', marginTop: '1rem', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(10,87,208,0.1)' }}>Confirm Address</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '200px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A57D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', marginBottom: '2px' }}>Service Address</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400, lineHeight: 1.4 }}>
                      {formData.address || 'Please provide your address'}
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsEditingAddress(true)} className="outline-btn-dhoond">
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Contact Number Card */}
          <div className="checkout-card" style={{ padding: '1.75rem' }}>
            {isEditingPhone ? (
              <div style={{ width: '100%', animation: 'fadeIn 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A57D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginRight: '1.25rem', flexShrink: 0 }}><Phone size={24} /></div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem' }}>Contact Number</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" autoFocus />
                  <button onClick={() => setIsEditingPhone(false)} style={{ background: '#0a57d0', color: '#fff', padding: '0 1.5rem', borderRadius: '10px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Save</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A57D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', marginBottom: '2px' }}>Contact Number</div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 400 }}>
                      {formData.phone || 'Please verify your phone number'}
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsEditingPhone(true)} className="outline-btn-dhoond">
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Summary Details (36% width on desktop, 100% on mobile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: isMobile ? '100%' : '36%' }}>
          
          {/* Payment Summary card */}
          <div className="checkout-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1.5rem 0', letterSpacing: '-0.02em' }}>Payment summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569', fontWeight: 500, fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Item total</span>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 500 }}>₹{subtotal.toFixed(0)}</span>
              </div>

              {totalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #d1fae5' }}>
                  <span style={{ color: '#0F8A5F', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Tag size={16} /> Promotional Discount</span>
                  <span style={{ color: '#0F8A5F', fontWeight: 600 }}>− ₹{totalDiscount.toFixed(0)}</span>
                </div>
              )}

              <div style={{ borderTop: '2px dashed #f1f5f9' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Price (excl. GST)</span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>₹{netPrice.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>GST <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>18%</span></span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>+ ₹{inclusiveTax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.05rem' }}>Total</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.15rem' }}>₹{total.toFixed(0)}</span>
              </div>

              {tipAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>Tip for Professional</span>
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>+ ₹{tipAmount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '16px', padding: '1.25rem', marginTop: '0.5rem', boxShadow: '0 8px 20px rgba(15,23,42,0.15)' }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Amount to Pay</span>
                <span style={{ color: '#fef08a', fontWeight: 600, fontSize: '1.4rem', textShadow: '0 2px 10px rgba(254,240,138,0.2)' }}>₹{finalAmountToPay.toFixed(0)}</span>
              </div>
            </div>

            <button onClick={handleBook} disabled={status === 'booking' || status === 'payment'} style={{ width: '100%', background: '#0a57d0', color: '#fff', padding: '1.25rem', borderRadius: '16px', border: 'none', fontWeight: 600, fontSize: '1.15rem', boxShadow: '0 8px 30px rgba(10,87,208,0.35)', cursor: (status === 'booking' || status === 'payment') ? 'not-allowed' : 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onMouseEnter={e => { if(status !== 'booking' && status !== 'payment') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(10,87,208,0.45)'; } }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(10,87,208,0.35)'; }}>
              {status === 'booking' || status === 'payment' ? 'Processing Securely...' : `Proceed to Pay • ₹${finalAmountToPay.toFixed(0)}`}
              {status !== 'booking' && status !== 'payment' && <ArrowRight size={20} />}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
              <ShieldCheck size={14} color="#059669" /> Payments are 100% secure & encrypted
            </div>

            {/* Tip Selector Section */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #f1f5f9', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={18} color="#2563eb" /> Add a tip to thank the Professional</div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: isCustomTipping ? '1rem' : 0 }}>
                {[50, 75, 100].map(amt => (
                  <button key={amt} onClick={() => { setTipAmount(amt === tipAmount ? 0 : amt); setIsCustomTipping(false); }} style={{ flex: 1, padding: '0.85rem 0', borderRadius: '12px', border: tipAmount === amt ? '2px solid #0a57d0' : '1px solid #e2e8f0', background: tipAmount === amt ? '#eff6ff' : '#fff', color: tipAmount === amt ? '#0a57d0' : '#475569', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tipAmount === amt ? '0 4px 15px rgba(10,87,208,0.1)' : '0 2px 5px rgba(0,0,0,0.02)' }}>₹{amt}</button>
                ))}
                <button onClick={() => { setIsCustomTipping(v => !v); setCustomTip(''); }} style={{ flex: 1, padding: '0.85rem 0', borderRadius: '12px', border: isCustomTipping ? '2px solid #0a57d0' : '1px solid #e2e8f0', background: isCustomTipping ? '#eff6ff' : '#fff', color: isCustomTipping ? '#0a57d0' : '#475569', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>{isCustomTipping ? 'Cancel' : 'Custom'}</button>
              </div>
              {isCustomTipping && (
                <div style={{ marginTop: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '0.3rem 0.3rem 0.3rem 1rem', gap: '8px', transition: 'border-color 0.2s' }}>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '1.1rem' }}>₹</span>
                    <input type="number" value={customTip} onChange={e => setCustomTip(Math.min(Number(e.target.value.replace(/\D/g, '')), 500).toString())} placeholder="Enter amount (max ₹500)" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1.05rem', fontWeight: 500, color: '#0f172a' }} autoFocus />
                    <button onClick={() => { const val = Number(customTip); if (val > 0) { setTipAmount(val); setIsCustomTipping(false); setCustomTip(''); } }} style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: '#0a57d0', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(10,87,208,0.2)' }}>Apply</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Yellow Savings banner */}
          {totalDiscount > 0 && (
            <div className="yellow-saving-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M19 12a7 7 0 1 1-14 0c0-2.8 1.8-5.3 4.5-6.2L12 3l2.5 2.8C17.2 6.7 19 9.2 19 12z"/><path d="M12 9v6M9 12h6"/></svg>
              <span>You are saving ₹{totalDiscount.toFixed(0)} on this order</span>
            </div>
          )}
        </div>
      </div>

      {/* Date/Time Modal */}
      {isSlotModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '2rem', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>Select Service Slot</h3>
              <button onClick={() => setIsSlotModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}><X size={18} /></button>
            </div>
            
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Pick a Date</div>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {dates.map(d => (
                <button key={d.id} onClick={() => { setTempDate(d.display); setTempTime(''); }} style={{ padding: '0.85rem 1.25rem', borderRadius: '14px', flexShrink: 0, background: tempDate === d.display ? '#2563eb' : '#fff', color: tempDate === d.display ? '#fff' : '#475569', border: tempDate === d.display ? '2px solid #2563eb' : '2px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', minWidth: '100px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: tempDate === d.display ? 500 : 600, opacity: tempDate === d.display ? 0.9 : 0.6, marginBottom: '2px' }}>{d.label}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{d.date.split(' ')[0]} <span style={{ fontSize: '0.85rem' }}>{d.date.split(' ')[1]}</span></div>
                </button>
              ))}
            </div>

            {tempDate && (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Pick a Time</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {getAvailableSlots(tempDate).map(slot => (
                    <button key={slot.time} onClick={() => setTempTime(slot.time)} style={{ padding: '1rem', borderRadius: '12px', background: tempTime === slot.time ? '#eff6ff' : '#fff', color: tempTime === slot.time ? '#1e40af' : '#475569', border: tempTime === slot.time ? '2px solid #2563eb' : '2px solid #e2e8f0', fontWeight: tempTime === slot.time ? 600 : 500, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button onClick={handleConfirmSlot} disabled={!tempDate || !tempTime} style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: 'none', background: (tempDate && tempTime) ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#e2e8f0', color: (tempDate && tempTime) ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '1.05rem', cursor: (tempDate && tempTime) ? 'pointer' : 'not-allowed', boxShadow: (tempDate && tempTime) ? '0 8px 20px rgba(15,23,42,0.2)' : 'none', transition: 'all 0.2s' }} onMouseEnter={e => { if(tempDate && tempTime) e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { if(tempDate && tempTime) e.currentTarget.style.transform = 'translateY(0)' }}>Confirm Slot</button>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setTimeout(openRazorpayCheckout, 500)} />
    </div>
  );
};

export default Checkout;
