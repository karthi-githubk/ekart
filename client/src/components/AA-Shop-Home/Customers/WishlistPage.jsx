import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Button,
  Snackbar,
  Alert,
  Slide,
  Container,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import {
  removeFromWishlist,
  selectWishlist,
} from "../../redux/slices/Items/wishlist";
import emptyWishlistImage from "../../images/empty-wishlist.png";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

function WishlistPage() {
  const wishlist = useSelector(selectWishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false); // Close Snackbar
  };

  // Pagination variables (example: adjust based on your pagination logic)
  const totalPages = Math.ceil(wishlist.length / 9); // Assuming 9 items per page
  const [page, setPage] = useState(1); // Current page state

  // Pagination change handler
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Slice wishlist items based on pagination
  const startIndex = (page - 1) * 9;
  const slicedWishlist = wishlist.slice(startIndex, startIndex + 9);

  return (
    <Box sx={{ p: 3 }}>
      {wishlist.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={emptyWishlistImage}
            alt="No items in wishlist"
            style={{ width: "50%", height: "auto" }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(`/products`)}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Container>
          <Grid container spacing={3} justifyContent="center" mt={3}>
            {slicedWishlist.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <img
                            src={`https://ekart-57l0.onrender.com/uploads/product/${product.image[0]}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        borderRadius: "12px",
                        marginTop: "10px",
                      }}
                    />
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      sx={{ marginTop: "10px" }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
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
        </Container>
      )}

      {/* Snackbar for notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%", backgroundColor: "#4cd137", color: "#fff" }}
        >
          Removed from Wishlist!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default WishlistPage;
