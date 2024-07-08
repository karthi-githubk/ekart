import React, { useState ,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Slide,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox, // Import Checkbox component from MUI
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  removeFromCart,
  clearCart,
  selectCartItems,
  updateQuantity,
} from "../../redux/slices/Items/cart";
import { useNavigate } from "react-router-dom";
import emptyCartImage from "../../images/empty-cart.jpg";
import { createPaymentIntent } from "../../redux/slices/payment/payment";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Swal from 'sweetalert2';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const paymentStatus = useSelector((state) => state.payment.status);
  const clientSecret = useSelector((state) => state.payment.clientSecret);
  const totalPages = Math.ceil(cartItems.length / 5); 
  const [page, setPage] = useState(1); 

  
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (paymentStatus === "succeeded" && clientSecret) {
      setTimeout(() => {
        navigate("/payment-success");
      }, 4000); 
    }
  }, [paymentStatus, clientSecret, navigate]);


  const handleCheckout = () => {
    Swal.fire({
      title: 'Processing Payment',
      text: 'Please wait...',
      allowOutsideClick: false,
      showConfirmButton: false,
      onOpen: () => {
        dispatch(createPaymentIntent(cartItems));
      }
    });

    // Close SweetAlert and show success message after 3 seconds
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        showConfirmButton: false,
        timer: 3000 // Close alert after 2 seconds
      }).then(() => {
        navigate("/payment-success");
      });
    }, 4000);
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    setOpenSnackbar(true); 
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, newQuantity }));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false); // Close Snackbar
  };

  return (
    <Grid container justifyContent="center" sx={{ padding: "20px" }}>
      <Grid item xs={12} md={10} lg={10}>
        <Paper>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={emptyCartImage}
                alt="No items in cart"
                style={{ width: "50%", height: "auto" }}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => navigate(`/products`)}
                sx={{ marginBottom: "7px" }}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ color: "white", backgroundColor: "#373A40" }}
                      >
                        Product
                      </TableCell>
                      <TableCell
                        style={{ color: "white", backgroundColor: "#373A40" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        style={{ color: "white", backgroundColor: "#373A40" }}
                      >
                        Price
                      </TableCell>
                      <TableCell
                        style={{ color: "white", backgroundColor: "#373A40" }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        style={{ color: "white", backgroundColor: "#373A40" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <img
                               src={`https://ekart-57l0.onrender.com/uploads/product/${item.image[0]}`}
                            alt={item.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "70px",
                              marginBottom: "10px",
                              borderRadius: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item>
                              <ToggleButtonGroup
                                size="large"
                                exclusive
                                color="primary"
                              >
                                <ToggleButton
                                  value="decrement"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  sx={{
                                    fontWeight: "bolder",
                                    color: "#FF0000",
                                  }}
                                >
                                  -
                                </ToggleButton>
                                <ToggleButton   sx={{
                                    fontWeight: "bolder",
                                    color: "#1e90ff",
                                  }}>
                                  {item.quantity}
                                </ToggleButton>
                                <ToggleButton
                                  value="increment"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity + 1
                                    )
                                  }
                                  sx={{
                                    fontWeight: "bolder",
                                    color: "#06D001",
                                  }}
                                >
                                  +
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </Grid>
                          </Grid>
                        </TableCell>

                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveFromCart(item._id)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                  marginRight: "20px",
                }}
              >
                <Button variant="contained"  sx={{color:'white', backgroundColor:'#1e90ff'}}  onClick={handleCheckout}>
                  Pay ₹{calculateTotalPrice()}
                </Button>
              </Box>
              <Card style={{ marginTop: "20px" }}>
                <CardContent>
                  <Typography variant="h6">
                    Total: ₹{calculateTotalPrice()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                </CardActions>
              </Card>
            </>
          )}
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
  <Pagination
    count={totalPages}
    page={page}
    onChange={handleChangePage}
    renderItem={(item) => (
      <PaginationItem
        {...item}
        sx={{
          "&.Mui-selected": {
            backgroundColor: "orange",
            color: "white",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "darkorange",
          },
        }}
      />
    )}
  />
</Box>

      </Grid>

      {/* Snackbar for notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Adjust as needed
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "400px",
            backgroundColor: "#4cd137",
            color: "#fff",
          }}
        >
          Item removed from Cart!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default CartPage;
