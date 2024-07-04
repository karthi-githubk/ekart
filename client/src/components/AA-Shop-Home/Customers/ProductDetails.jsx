import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Slide,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  fetchProductById,
  selectProductsLoading,
  selectProducts,
} from "../../redux/slices/product/product";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { addToCart } from "../../redux/slices/Items/cart";
import { selectUserInfo } from "../../redux/slices/user/signin";
import LoyaltyIcon from '@mui/icons-material/Loyalty';


function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const loading = useSelector(selectProductsLoading);
  const products = useSelector(selectProducts);
  const [expanded, setExpanded] = useState(false);
  const [openCartSnackbar, setOpenCartSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const productDetails = products.find((product) => product._id === productId);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!productDetails) {
    return <Typography>Product not found</Typography>;
  }

  const productImage = productDetails.image && productDetails.image[0];

  const truncateDescription = (description, maxLength) => {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCartSnackbar(false);
  };

  const handleAddToCart = (product) => {
    if (!userInfo) {
      // User not signed in
      alert("Please sign in to add to cart!");
      return;
    }

    dispatch(addToCart(product));
    setOpenCartSnackbar(true);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Left Side: Product Image */}
          <Card>
            {productImage && (
              <CardMedia
                component="img"
                height="auto"
                image={`http://localhost:5005/uploads/product/${productImage}`}
                alt={productDetails.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                }}
              />
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Right Side: Product Details */}
          <Card>
            <CardContent>
            <Typography variant="h6" sx={{textAlign:'right',color:'#ff5e57'}}>
            <LoyaltyIcon  /> {productDetails.tags}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {productDetails.name}
              </Typography>
              <Typography variant="h6">
                {expanded
                  ? productDetails.description
                  : truncateDescription(productDetails.description, 50)}
              </Typography>
              {productDetails.description.length > 50 && (
                <Button onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Show less" : "Show more"}
                </Button>
              )}
              <Typography variant="h6">
                Price: ₹{productDetails.price}
              </Typography>
              <Typography variant="h6">
                Stocks: {productDetails.stock}
              </Typography>
              <div>
                <Rating
                  name="product-rating"
                  value={productDetails.ratings}
                  precision={0.5}
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#ffb400",
                    },
                  }}
                />
              </div>
              <div  style={{
                      
                      marginTop: "10px",
                    }}>
                <Button
                  startIcon={<ShoppingCart />}
                  color="error"
                  variant="contained"
                  style={{
                    fontSize: "0.75rem",
                    padding: "4px 8px",
                   width:'200px',
                   height:'40px',
                   backgroundColor:'#f53b57'
                  }}
                  onClick={() => handleAddToCart(productDetails)}
                >
                  Add To Cart
                </Button>
              </div>
            </CardContent>
          </Card>
          <Snackbar
            open={openCartSnackbar}
            autoHideDuration={6000}
            onClose={(event, reason) => handleSnackbarClose(reason)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
            sx={{ height: "80px" }}
          >
            <Alert
              onClose={() => handleSnackbarClose("snackbar")}
              severity="success"
              variant="filled"
              sx={{
                width: "400px",
                backgroundColor: "#4cd137",
                color: "#fff",
              }}
            >
              Product Added to Cart Successfully!
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetails;
