const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateTotalPrice = (items) => {
  // Implement this function based on your cart items structure
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

exports.createPaymentIntent = async (req, res) => {
  const { items } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateTotalPrice(items) * 100,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err.message);
    res.status(500).json({ error: "Unable to create payment intent" });
  }
};
