const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.jsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Simple replacements
  content = content.replace(/http:\/\/localhost:5000\/api\/auth/g, 'http://localhost:5000/api/V1/auth');
  content = content.replace(/http:\/\/localhost:5000\/api\/services/g, 'http://localhost:5000/api/V1/services');
  content = content.replace(/http:\/\/localhost:5000\/api\/admin\/services/g, 'http://localhost:5000/api/V1/services');
  content = content.replace(/http:\/\/localhost:5000\/api\/admin\/partners/g, 'http://localhost:5000/api/V1/partners');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});

// Advanced replacements for Checkout.jsx to map Bookings & Razorpay out to purely Atithi endpoints
const checkoutPath = path.join(srcDir, 'pages', 'Checkout.jsx');
if (fs.existsSync(checkoutPath)) {
  let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
  
  // Replace the entire processFinalBooking and openRazorpayCheckout with a generic hit against V1 APIs
  const atithiCheckoutLogic = `
  const processFinalBooking = async () => {
    const trimmedPhone = String(formData.phone || '').trim();
    const trimmedAddress = String(formData.address || '').trim();

    if (!trimmedPhone || !trimmedAddress) {
      alert('Please add your phone and address before booking.');
      return;
    }

    setStatus('booking');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      // Create Order in Atithi format
      const orderResponse = await fetch(\`\${apiUrl}/api/V1/orders\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 1,
          partner_id: null,
          category_id: 1, // Mock
          address: trimmedAddress,
          price: finalAmountToPay,
          platform_fee: 0
        })
      });

      if (!orderResponse.ok) throw new Error('Order creation failed');
      const orderData = await orderResponse.json();
      const orderId = orderData.data?.id;

      // Create Payment for this Order in Atithi format
      setStatus('payment');
      const paymentResponse = await fetch(\`\${apiUrl}/api/V1/payments\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount: finalAmountToPay,
          payment_method: selectedPayment,
          payment_status: 'paid',
          transaction_id: 'TXN-' + Date.now()
        })
      });
      
      if (!paymentResponse.ok) throw new Error('Payment processing failed');

      // Success
      setStartOtp(Math.floor(1000 + Math.random() * 9000).toString());
      setStatus('success');
      setTimeout(() => {
        clearCart();
      }, 1000);
      
    } catch (error) {
      console.error('Booking Error:', error);
      alert(\`Booking failed: \${error.message}\`);
      setStatus('idle');
    }
  };

  // We are removing razorpay specifically for Atithi matching
  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot first.");
      return;
    }
    if (!isAuthenticated) { setIsAuthModalOpen(true); return; }
    setPaymentError('');
    processFinalBooking();
  };
`;

  // We find and slice out the razorpay checkout block and the old process final block
  // Using a regex or strict replace is tricky. Let's do it precisely via line replacement matching.
  const regexDropRazorpay = /const openRazorpayCheckout = async(.*?)const handleBook = \(\) => {/gs;
  checkoutContent = checkoutContent.replace(regexDropRazorpay, atithiCheckoutLogic.replace('const handleBook = () => {', ''));
  
  // also replace the old processFinalBooking
  const regexDropProcessFinal = /const processFinalBooking = async \(\) => \{.*?(?=\s+const startResendTimer = \(\) => \{)/gs;
  checkoutContent = checkoutContent.replace(regexDropProcessFinal, "");
  
  // write 
  fs.writeFileSync(checkoutPath, checkoutContent);
}

console.log('Frontend APIs successfully mapped to /api/V1');
