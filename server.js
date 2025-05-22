const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// M-Pesa endpoint
app.post('/api/initiate-stk', async (req, res) => {
  const { phone, amount } = req.body;
  
  try {
    // 1. Get M-Pesa token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const { data: { access_token } } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    // 2. Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -4);
    const password = Buffer.from(`${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: 'https://your-app-name.up.railway.app/api/callback',
        AccountReference: 'TeaForMaxwell',
        TransactionDesc: 'Support Maxwell'
      },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("STK Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment failed. Try again." });
  }
});

// Handle all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));