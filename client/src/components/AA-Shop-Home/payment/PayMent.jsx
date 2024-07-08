import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const cartItems = useSelector((state) => state.cart.items); // Assuming cart items are stored in state.cart.items
  const paymentStatus = useSelector((state) => state.payment.status);
  const clientSecret = useSelector((state) => state.payment.clientSecret);
  const navigate = useNavigate();

  // Calculate total amount paid
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate total amount based on items in the cart
    let total = 0;
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);

    // Redirect to payment success page if payment is successful
    if (paymentStatus === 'succeeded' && clientSecret) {
      navigate('/payment-success'); // Navigate to success page if payment succeeded
    }
  }, [paymentStatus, clientSecret, cartItems, navigate]);

  // Show loading indicator if payment status is pending
  if (paymentStatus === 'pending') {
    return (
  
    );
  }

  // Display payment status, total amount, and products purchased
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Total Amount Paid: ₹{totalAmount}
      </Typography>
      {cartItems.length > 0 && (
        <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
          {cartItems.map((item) => (
            <Grid item key={item._id}>
              <Card style={{ maxWidth: 300 }}>
                <img
                  src={`https://ekart-57l0.onrender.com/uploads/product/${item.image[0]}`}
                  alt={item.name}
                  style={{
                    width: '100%',
                    maxHeight: 150,
                    objectFit: 'cover',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
                <CardContent>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body1">Price: ₹{item.price}</Typography>
                  <Typography variant="body1">Quantity: {item.quantity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Payment;
