const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require('dotenv').config();
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const path = require("path");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // for taking data from post request(body-parser)
app.use(
  cors({
    origin: ["https://ekart-chi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Content-Length", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());


app.use(
  "/uploads/users",
  express.static(path.join(__dirname, "uploads/users"))
);


app.use(
  "/uploads/categeory",
  express.static(path.join(__dirname, "uploads/categeory"))
);

app.use(
  "/uploads/product",
  express.static(path.join(__dirname, "uploads/product"))
);


app.get("/", (req, res) => res.send("API Running"));


app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", contactRoutes);
app.use('/', paymentRoutes);



const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
