import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, CreditCard, Tag, Percent, Phone, SquareCheck, Square, Info, X, Calendar, Edit2, CheckCircle2, ShieldCheck, Lock, Smartphone, ChevronRight, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart, updateQuantity } = useCart();
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Data States
  const [formData, setFormData] = useState({
    phone: user?.mobile || '', 
    address: 'Home - 78, 25th Main Rd, near Kamataka Ban...'
  });

  // Flow Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // phone, otp
  const [tempPhone, setTempPhone] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [startOtp, setStartOtp] = useState('');
  
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
  const [selectedPayment, setSelectedPayment] = useState('pay_after'); // pay_after, upi, card
  const [avoidCalling, setAvoidCalling] = useState(true);
  const [status, setStatus] = useState('idle'); // idle, booking, payment, success
  const [showBreakup, setShowBreakup] = useState(false);
  
  // Tip State
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTipping, setIsCustomTipping] = useState(false);

  // Financial Math
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.originalPrice || item.discountPrice || 0) * (item.quantity || 1)), 0);
  const totalDiscount = cartItems.reduce((acc, item) => acc + ((Number(item.originalPrice || item.discountPrice || 0) - Number(item.discountPrice || 0)) * (item.quantity || 1)), 0);
  const itemTotal = subtotal - totalDiscount;
  const taxesAndFee = 129; 
  const finalAmountToPay = itemTotal + taxesAndFee + tipAmount;
  if (status === 'success') {
    return (
      <div style={{ padding: '6rem 5%', textAlign: 'center', background: '#f9f9f9', minHeight: '80vh' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(10px)' }}></div>
          <CheckCircle2 size={84} color="#10b981" style={{ position: 'relative' }} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#111' }}>Booking Confirmed!</h2>
        <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Great! Your professional arrives on <b>{selectedDate}</b> at <b>{selectedTime}</b>.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
             <h3 style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Booking ID</h3>
             <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '2px' }}>DHD-{Math.floor(Math.random() * 90000) + 10000}</p>
          </div>
          <div style={{ background: '#111', border: '1px solid #111', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: '#fff' }}>
             <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Service Start OTP</h3>
             <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '8px' }}>{startOtp}</p>
             <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Share this with your professional at the door</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: '#6e42e5', color: '#fff', padding: '1rem 2.5rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(110,66,229,0.3)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>Track Booking</button>
          <button onClick={() => navigate('/')} style={{ background: '#fff', color: '#111', padding: '1rem 2.5rem', borderRadius: '12px', border: '1px solid #ddd', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot first.");
      return;
    }

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (selectedPayment !== 'pay_after') {
      setIsPaymentModalOpen(true);
      return;
    }

    processFinalBooking();
  };

  const processFinalBooking = async () => {
    setStatus('booking');
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: user?.name || 'Customer', // Fallback if no name
          phone: formData.phone,
          address: formData.address,
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const result = await response.json();
      setStartOtp(result.startOtp);
      setStatus('success');
      setTimeout(() => clearCart(), 1000);
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Failed to place booking. Please try again.');
      setStatus('idle');
    }
  };

  const handleSendOtp = () => {
    if (tempPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setAuthStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otpValue.join('').length < 4) return;
    
    // Simulate verification
    login(tempPhone);
    setFormData(prev => ({ ...prev, phone: tempPhone }));
    setIsAuthModalOpen(false);
    
    // Resume flow: if payment is online, show payment, else booking
    if (selectedPayment !== 'pay_after') {
      setIsPaymentModalOpen(true);
    } else {
      processFinalBooking();
    }
  };

  const handlePaymentSubmit = () => {
    setIsPayLoading(true);
    setTimeout(() => {
      setIsPayLoading(false);
      setIsPaymentModalOpen(false);
      processFinalBooking();
    }, 2000);
  };

  const handleApplyCustomTip = () => {
    const val = Number(customTip);
    if (val > 0) {
      setTipAmount(val);
      setIsCustomTipping(false);
    }
  };

  const handleConfirmSlot = () => {
    if(tempDate && tempTime) {
      setSelectedDate(tempDate);
      setSelectedTime(tempTime);
      setIsSlotModalOpen(false);
    }
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '4rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '1.25rem 5%', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.2rem', color: '#111', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ background: '#111', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '1rem' }}>DC</div> Checkout
        </div>
      </div>

      <div className="checkout-grid" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 5%', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Tag size={16} fill="currentColor" /> Saving ₹{totalDiscount.toFixed(0)} on this order
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
             
             {/* 1. Contact Details */}
             <div style={{ padding: '1.5rem', borderBottom: '1px solid #eaeaea' }}>
               {isEditingPhone ? (
                 <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone Number</label>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} autoFocus />
                     <button onClick={() => setIsEditingPhone(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                   </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', marginRight: '1.25rem' }}>
                        <Phone size={20} color="#555" />
                     </div>
                     <div>
                       <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111', marginBottom: '0.2rem' }}>Send booking details to</div>
                       <div style={{ fontSize: '0.85rem', color: '#666' }}>{formData.phone}</div>
                     </div>
                   </div>
                   <button onClick={() => setIsEditingPhone(true)} style={{ background: 'transparent', border: 'none', color: '#6e42e5', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Edit2 size={12}/> Edit</button>
                 </div>
               )}
             </div>

             {/* 2. Address Details */}
             <div style={{ padding: '1.5rem', borderBottom: '1px solid #eaeaea' }}>
               {isEditingAddress ? (
                 <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Service Address</label>
                   <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', marginBottom: '0.75rem', resize: 'vertical' }} autoFocus />
                   <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                     <button onClick={() => setIsEditingAddress(false)} style={{ background: '#f3f4f6', color: '#111', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                     <button onClick={() => setIsEditingAddress(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Address</button>
                   </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', marginRight: '1.25rem' }}>
                        <MapPin size={20} color="#555" />
                     </div>
                     <div>
                       <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111', marginBottom: '0.2rem' }}>Address</div>
                       <div style={{ fontSize: '0.85rem', color: '#666' }}>{formData.address}</div>
                     </div>
                   </div>
                   <button onClick={() => setIsEditingAddress(true)} style={{ background: '#fff', border: '1px solid #ddd', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', color: '#111' }}>Edit</button>
                 </div>
               )}
             </div>

             {/* 3. Slot Selection */}
             <div style={{ padding: '1.5rem', borderBottom: '1px solid #eaeaea', background: selectedDate ? '#fafafa' : '#fff' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                   <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', marginRight: '1.25rem' }}>
                      <Clock size={20} color={selectedDate ? '#10b981' : '#555'} />
                   </div>
                   <div>
                     <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>Slot</div>
                     {selectedDate && <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginTop: '0.2rem' }}>{selectedDate} at {selectedTime}</div>}
                   </div>
                 </div>
                 {selectedDate && <button onClick={() => setIsSlotModalOpen(true)} style={{ background: 'transparent', border: 'none', color: '#6e42e5', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Change</button>}
               </div>
               
               {!selectedDate && (
                 <button onClick={() => setIsSlotModalOpen(true)} style={{ width: '100%', background: '#6e42e5', color: '#fff', padding: '1.1rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 14px rgba(110,66,229,0.3)' }} onMouseEnter={e => e.currentTarget.style.background = '#5b32cc'} onMouseLeave={e => e.currentTarget.style.background = '#6e42e5'}>
                   Select time & date
                 </button>
               )}
             </div>

             {/* 4. Payment Method */}
             <div style={{ padding: '1.5rem', opacity: selectedDate ? 1 : 0.4, transition: 'opacity 0.3s' }}>
               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                 <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', marginRight: '1.25rem' }}>
                    <CreditCard size={20} color="#555" />
                 </div>
                 <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>Payment Method</div>
               </div>

               {selectedDate && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '3.75rem', animation: 'fadeIn 0.3s ease-in' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input type="radio" name="payment" checked={selectedPayment === 'pay_after'} onChange={() => setSelectedPayment('pay_after')} style={{ width: '18px', height: '18px', accentColor: '#6e42e5' }} />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111' }}>Pay after service</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input type="radio" name="payment" checked={selectedPayment === 'upi'} onChange={() => setSelectedPayment('upi')} style={{ width: '18px', height: '18px', accentColor: '#6e42e5' }} />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111' }}>UPI / Net Banking</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input type="radio" name="payment" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} style={{ width: '18px', height: '18px', accentColor: '#6e42e5' }} />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111' }}>Credit / Debit Card</span>
                    </label>

                    <button onClick={handleBook} disabled={status === 'booking'} style={{ marginTop: '1rem', width: '100%', background: '#111', color: '#fff', padding: '1.1rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: status === 'booking' ? 'wait' : 'pointer' }}>
                      {status === 'booking' ? 'Processing...' : `Place Booking • ₹${finalAmountToPay.toFixed(0)}`}
                    </button>
                  </div>
               )}
             </div>
          </div>

          <div style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '0.5rem' }}>Cancellation policy</div>
            <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>Free cancellations if done more than 12 hrs before the service. A fee will be charged otherwise.</p>
            <span onClick={() => alert("Full policy details stub")} style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111', textDecoration: 'underline', cursor: 'pointer' }}>Read full policy</span>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          
          {/* Cart Block */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', margin: '0 0 1.5rem 0' }}>{cartItems.length > 0 ? (cartItems[0].category === 'painter' ? 'Painting' : cartItems[0].category === 'electrician' ? 'Electrician' : 'AC') : 'Services'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
               {cartItems.map((item) => (
                 <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '0.9rem', color: '#111', fontWeight: 500, lineHeight: 1.4 }}>{item.title}</div>
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     {/* Counter */}
                     <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e0d4fc', borderRadius: '8px', padding: '0.1rem' }}>
                        <button style={{ background: 'transparent', border: 'none', width: '28px', height: '28px', cursor: 'pointer', color: '#6e42e5', fontWeight: 600, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span style={{ width: '24px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: '#6e42e5' }}>{item.quantity}</span>
                        <button style={{ background: 'transparent', border: 'none', width: '28px', height: '28px', cursor: 'pointer', color: '#6e42e5', fontWeight: 600, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
                     </div>
                     
                     {/* Price */}
                     <div style={{ textAlign: 'right', minWidth: '60px' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>₹{Number(item.discountPrice || 0).toFixed(0)}</div>
                       {item.originalPrice > item.discountPrice && (
                         <div style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'line-through' }}>₹{Number(item.originalPrice || 0).toFixed(0)}</div>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setAvoidCalling(!avoidCalling)}>
              {avoidCalling ? (
                <div style={{ width: '20px', height: '20px', background: '#111', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SquareCheck size={14} color="#fff" strokeWidth={3} />
                </div>
              ) : (
                <div style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderRadius: '4px' }}></div>
              )}
              <span style={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>Avoid calling before reaching the location</span>
            </div>
          </div>

          {/* Offers Block */}
          <div onClick={() => alert("Offers integration coming soon!")} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#059669', borderRadius: '50%', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Percent size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>Coupons and offers</span>
            </div>
            <span style={{ color: '#6e42e5', fontWeight: 600, fontSize: '0.9rem' }}>6 offers &gt;</span>
          </div>

          {/* Payment Summary */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', overflow: 'hidden', transition: 'all 0.3s' }}>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 1.25rem 0' }}>Payment summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555' }}>
                  <span>Item total</span>
                  <div>
                    {totalDiscount > 0 && <span style={{ textDecoration: 'line-through', marginRight: '0.5rem', color: '#aaa' }}>₹{subtotal.toFixed(0)}</span>}
                    <span style={{ color: '#111' }}>₹{itemTotal.toFixed(0)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline', textDecorationStyle: 'dashed' }}>Taxes and Fee</span>
                  <span style={{ color: '#111' }}>₹{taxesAndFee}</span>
                </div>
                
                {/* Breakup Animation Area */}
                {showBreakup && tipAmount > 0 && (
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669', animation: 'fadeIn 0.2s ease-in' }}>
                     <span>Added Tip</span>
                     <span>+ ₹{tipAmount}</span>
                   </div>
                )}
              </div>

              <div style={{ padding: '1rem 0', borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <span>Total amount</span>
                <span>₹{(itemTotal + taxesAndFee).toFixed(0)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#111', fontSize: '0.9rem', marginBottom: '2rem' }}>
                <span>Amount to pay</span>
                <span>₹{finalAmountToPay.toFixed(0)}</span>
              </div>

              {/* Tipping Section */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', marginBottom: '1rem' }}>Add a tip to thank the Professional</div>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {[50, 75, 100].map((amt) => (
                    <button 
                      key={amt} 
                      onClick={() => { setTipAmount(tipAmount === amt ? 0 : amt); setIsCustomTipping(false); setShowBreakup(true); }}
                      style={{ 
                        padding: '0.5rem 1rem', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s',
                        borderRadius: '16px', fontWeight: 600, fontSize: '0.85rem',
                        background: tipAmount === amt && !isCustomTipping ? '#f5f3ff' : '#fff', 
                        border: tipAmount === amt && !isCustomTipping ? '1px solid #6e42e5' : '1px solid #eaeaea', 
                        color: tipAmount === amt && !isCustomTipping ? '#6e42e5' : '#111', 
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                  
                  <div style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
                    {isCustomTipping ? (
                      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #6e42e5', borderRadius: '16px', overflow: 'hidden' }}>
                        <span style={{ paddingLeft: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#111' }}>₹</span>
                        <input type="number" min="0" value={customTip} onChange={e => setCustomTip(e.target.value)} autoFocus style={{ width: '50px', border: 'none', outline: 'none', padding: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }} />
                        <button onClick={handleApplyCustomTip} style={{ background: '#6e42e5', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem' }}>OK</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setIsCustomTipping(true); setTipAmount(0); }}
                        style={{ 
                          padding: '0.5rem 1rem', background: (tipAmount > 0 && ![50,75,100].includes(tipAmount)) ? '#f5f3ff' : '#fff', 
                          border: (tipAmount > 0 && ![50,75,100].includes(tipAmount)) ? '1px solid #6e42e5' : '1px solid #eaeaea', 
                          borderRadius: '16px', fontWeight: 600, fontSize: '0.85rem', 
                          color: (tipAmount > 0 && ![50,75,100].includes(tipAmount)) ? '#6e42e5' : '#111', cursor: 'pointer' 
                        }}
                      >
                        {(tipAmount > 0 && ![50,75,100].includes(tipAmount)) ? `₹${tipAmount}` : 'Custom'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sticky Bottom Actions */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#fafafa', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111', margin: 0 }}>Amount to pay</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111', transition: 'color 0.2s', marginTop: '-0.2rem' }}>₹{finalAmountToPay.toFixed(0)}</div>
                <div onClick={() => setShowBreakup(!showBreakup)} style={{ fontSize: '0.75rem', color: '#6e42e5', fontWeight: 600, marginTop: '0.25rem', cursor: 'pointer', userSelect: 'none' }}>{showBreakup ? 'Hide Breakup' : 'View Breakup'}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Date/Time Modal */}
      {isSlotModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }}>
          <div className="slot-modal-panel" style={{ background: '#fff', width: '100%', maxWidth: '600px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '2rem', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} /> Select Slot</h3>
              <button onClick={() => setIsSlotModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
            </div>
            
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555', marginBottom: '0.75rem' }}>Select Date</h4>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
              {['Today, 9 Apr', 'Tomorrow, 10 Apr', 'Thu, 11 Apr'].map(d => (
                <button key={d} onClick={() => setTempDate(d)} style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', flexShrink: 0, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', background: tempDate === d ? '#f5f3ff' : '#fff', border: tempDate === d ? '2px solid #6e42e5' : '1px solid #ddd', color: tempDate === d ? '#6e42e5' : '#111', transition: 'all 0.2s' }}>
                  {d}
                </button>
              ))}
            </div>

            {tempDate && (
              <>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555', marginBottom: '0.75rem', animation: 'fadeIn 0.3s' }}>{tempDate} - Select Time</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem', animation: 'fadeIn 0.3s' }}>
                  {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(t => (
                    <button key={t} onClick={() => setTempTime(t)} style={{ padding: '0.85rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', background: tempTime === t ? '#f5f3ff' : '#fff', border: tempTime === t ? '2px solid #6e42e5' : '1px solid #ddd', color: tempTime === t ? '#6e42e5' : '#111', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button onClick={handleConfirmSlot} disabled={!tempDate || !tempTime} style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: 'none', background: (tempDate && tempTime) ? '#111' : '#e2e8f0', color: (tempDate && tempTime) ? '#fff' : '#94a3b8', fontSize: '1rem', fontWeight: 700, cursor: (tempDate && tempTime) ? 'pointer' : 'not-allowed', transition: 'background 0.3s' }}>
              Proceed to payment
            </button>
          </div>
        </div>
      )}
      
      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '420px', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #eee', position: 'relative' }}>
            <button onClick={() => setIsAuthModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f8fafc', border: 'none', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ background: '#f5f3ff', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Smartphone size={32} color="#6e42e5" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>{authStep === 'phone' ? 'Phone Verification' : 'Enter OTP'}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                {authStep === 'phone' 
                  ? 'We need to verify your phone number to proceed with the booking.' 
                  : `Enter the 4-digit code sent to +91 ${tempPhone}`}
              </p>
            </div>

            {authStep === 'phone' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#111', fontSize: '1rem' }}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter mobile number" 
                    value={tempPhone}
                    onChange={e => setTempPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '2px solid #eee', fontSize: '1.1rem', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#6e42e5'}
                    onBlur={e => e.target.style.borderColor = '#eee'}
                  />
                </div>
                <button onClick={handleSendOtp} style={{ width: '100%', background: '#111', color: '#fff', padding: '1.1rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Send OTP <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  {otpValue.map((digit, idx) => (
                    <input 
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={e => {
                        const val = e.target.value.slice(-1);
                        const newOtp = [...otpValue];
                        newOtp[idx] = val;
                        setOtpValue(newOtp);
                        if (val && idx < 3) document.getElementById(`otp-${idx+1}`).focus();
                      }}
                      style={{ width: '50px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, borderRadius: '12px', border: '2px solid #eee', outline: 'none', transition: 'border-color 0.2s', background: digit ? '#fdfaff' : '#fff' }}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleVerifyOtp} 
                  style={{ width: '100%', background: '#6e42e5', color: '#fff', padding: '1.1rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(110,66,229,0.3)' }}
                >
                  Verify & Proceed
                </button>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => setAuthStep('phone')} style={{ background: 'none', border: 'none', color: '#6e42e5', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Change Phone Number</button>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
              <ShieldCheck size={14} /> 100% Secure Verification
            </div>
          </div>
        </div>
      )}

      {/* Payment Loading Modal */}
      {isPaymentModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, flexDirection: 'column', animation: 'fadeIn 0.3s' }}>
          {isPayLoading ? (
            <div style={{ textAlign: 'center' }}>
              <div className="payment-spinner" style={{ width: '60px', height: '60px', border: '5px solid #f3f3f3', borderTop: '5px solid #6e42e5', borderRadius: '50%', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>Processing Payment</h3>
              <p style={{ color: '#666' }}>Please do not refresh or close clinical</p>
            </div>
          ) : (
            <div style={{ width: '90%', maxWidth: '400px', background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
                    <div style={{ background: '#111', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>DC</div> Pay Securely
                 </div>
                 <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
               </div>

               <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Amount to pay</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#111' }}>₹{finalAmountToPay.toFixed(0)}</div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '2px solid #6e42e5', borderRadius: '12px', background: '#f5f3ff' }}>
                    <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px' }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ width: '40px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Google Pay / PhonePe</div>
                       <div style={{ fontSize: '0.8rem', color: '#6e42e5', fontWeight: 600 }}>Connected via {user?.mobile}</div>
                    </div>
                    <CheckCircle size={20} color="#6e42e5" fill="#6e42e511" />
                 </div>

                 <button onClick={handlePaymentSubmit} style={{ width: '100%', background: '#111', color: '#fff', padding: '1.25rem', borderRadius: '14px', border: 'none', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                   Pay ₹{finalAmountToPay.toFixed(0)}
                 </button>
                 
                 <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <Lock size={12} /> SECURE ENCRYPTED TRANSACTION
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .payment-spinner { border-radius: 50%; }

        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            padding: 0 4% !important;
            margin-top: 1rem !important;
          }
          .slot-modal-panel {
            padding: 1.5rem !important;
            max-width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .checkout-grid {
            padding: 0 3% !important;
            gap: 1rem !important;
          }
          .slot-modal-panel {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
