import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination,
  Chip,
  Avatar,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Snackbar,
  Slide,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Rating from "@mui/material/Rating";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Visibility from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
} from "../../redux/slices/product/product";
import { addToWishlist } from "../../redux/slices/Items/wishlist";
import { addToCart } from "../../redux/slices/Items/cart";
import { selectUserInfo } from "../../redux/slices/user/signin";

function CustomerProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const userInfo = useSelector(selectUserInfo);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 2 : 6);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [openWishlistSnackbar, setOpenWishlistSnackbar] = useState(false);
  // const [openCartSnackbar, setOpenCartSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceRangeChange = (event, field) => {
    const { value } = event.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [field]: value,
    }));
  };
  const filterProducts = (product) => {
    const inPriceRange =
      (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || product.price <= parseFloat(priceRange.max));

    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return inPriceRange && matchesSearch && matchesCategories;
  };

  const handleCardClick = (productId) => {
    navigate(`/product/details/${productId}`);
  };

  const cardStyle = {
    width: "250px",
    marginBottom: "20px",
    marginLeft: "30px",
    transition: "transform 0.3s ease",
    position: "relative",
  };

  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenWishlistSnackbar(false);
    // setOpenCartSnackbar(false);
  };

  const handleAddToWishlist = (product) => {
    if (!userInfo) {
      // User not signed in
      alert("Please sign in to add to wishlist!");
      return;
    }

    dispatch(addToWishlist(product));
    setOpenWishlistSnackbar(true);
  };

  // const handleAddToCart = (product) => {

  //   if (!userInfo) {
  //     // User not signed in
  //     alert("Please sign in to add to cart!");
  //     return;
  //   }

  //   dispatch(addToCart(product));
  //   setOpenCartSnackbar(true);
  // };

  return (
    <Grid container spacing={isMobile ? 2 : 6}>
      {/* Left Side: Categories Filter */}
      <Grid item xs={12} md={3}>
        <Paper
          style={{
            padding: "12px",
            marginTop: "40px",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            marginLeft: "30px",
          }}
        >
          <TextField
            label="Search Products"
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="subtitle1"
            style={{
              marginTop: "1px",
              fontWeight: "bolder",
              textTransform: "uppercase",
            }}
          >
            Categories
          </Typography>
          <FormControl component="fieldset" style={{ marginTop: "10px" }}>
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      name={category.name}
                    />
                  }
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={`http://localhost:5005/uploads/categeory/${category.image[0]}`}
                        alt={category.name}
                        sx={{ marginRight: 1, width: 25, height: 25 }}
                      />
                      {category.name}
                    </div>
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
          {/* Price Range Filter */}
          <Typography
            variant="subtitle1"
            style={{
              marginTop: "20px",
              fontWeight: "bolder",
              textTransform: "uppercase",
            }}
          >
            Price Range
          </Typography>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <TextField
              label="Min"
              variant="outlined"
              size="small"
              margin="dense"
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange(e, "min")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ mr: 1, width: 100 }}
            />
            <TextField
              label="Max"
              variant="outlined"
              size="small"
              margin="dense"
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange(e, "max")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ ml: 1, width: 100 }}
            />
          </div>
        </Paper>
      </Grid>

      {/* Right Side: Products Display */}
      <Grid item xs={12} md={9}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "4%",
          }}
        >
          {products
            .filter(filterProducts)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) => (
              <Card
                key={product._id}
                style={cardStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                
              >
                <CardContent>
                  <div style={{ position: "relative" }}>
                    <img
                      src={`http://localhost:5005/uploads/product/${product.image[0]}`}
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        marginBottom: "10px",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ textTransform: "uppercase" }}
                    >
                      {product.name}
                    </Typography>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        gap: "5px",
                        padding: "5px",
                      }}
                    >
                      {product.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{
                            backgroundColor: "#e056fd",
                            fontSize: "0.75rem",
                            color: "#ffff",
                            fontWeight: "bolder",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Rating
                      name="product-rating"
                      value={product.ratings}
                      precision={0.5}
                      readOnly
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#ffb400",
                        },
                      }}
                    />
                  </div>
                  <Typography variant="h6"> Price: ₹{product.price}</Typography>
                  <Typography variant="h6">Stock: {product.stock}</Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      startIcon={<FavoriteBorder />}
                      size="small"
                   
                      style={{ fontSize: "0.75rem",  color:'#ffffff',backgroundColor:'#ff3f34'}}
                      onClick={() => handleAddToWishlist(product)}
                    >
                      Wishlist
                    </Button>

                    {/* <Button
                      startIcon={<ShoppingCart />}
                      color="primary"
                      size="small"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add Cart
                    </Button> */}
                    <Button
                      startIcon={<Visibility />}
                      size="small"
                      color="secondary"
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor:'#6c5ce7',
                        color:'#ffffff',
                      }}
                      onClick={() => handleCardClick(product._id)}
                    >
                      View More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        <Snackbar
          open={openWishlistSnackbar}
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
            Product Added to Wishlist Successfully!
          </Alert>
        </Snackbar>
        {/* <Snackbar
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
          Product  Added to Cart Successfully!
          </Alert>
        </Snackbar> */}
        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px", // Adjust margin as needed
          }}
        />
      </Grid>
    </Grid>
  );
}

export default CustomerProduct;







//backup for  the overlay card  component






// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Paper,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TablePagination,
//   Chip,
//   Avatar,
//   FormControl,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Grid,
//   TextField,
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
//   Snackbar,
//   Slide,
//   Alert,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import Rating from "@mui/material/Rating";
// import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
// import ShoppingCart from "@mui/icons-material/ShoppingCart";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchCategories,
//   selectCategories,
// } from "../../redux/slices/category/category";
// import {
//   fetchProducts,
//   selectProducts,
//   selectProductsLoading,
// } from "../../redux/slices/product/product";
// import { addToWishlist } from "../../redux/slices/Items/wishlist";
// import { addToCart } from "../../redux/slices/Items/cart";
// import { selectUserInfo } from "../../redux/slices/user/signin";

// function CustomerProduct() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const products = useSelector(selectProducts);
//   const categories = useSelector(selectCategories);
//   const loading = useSelector(selectProductsLoading);
//   const userInfo = useSelector(selectUserInfo);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 2 : 6);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [openWishlistSnackbar, setOpenWishlistSnackbar] = useState(false);
//   // const [openCartSnackbar, setOpenCartSnackbar] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategories((prevSelectedCategories) => {
//       if (prevSelectedCategories.includes(categoryId)) {
//         return prevSelectedCategories.filter((id) => id !== categoryId);
//       } else {
//         return [...prevSelectedCategories, categoryId];
//       }
//     });
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handlePriceRangeChange = (event, field) => {
//     const { value } = event.target;
//     setPriceRange((prevRange) => ({
//       ...prevRange,
//       [field]: value,
//     }));
//   };
//   const filterProducts = (product) => {
//     const inPriceRange =
//       (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
//       (!priceRange.max || product.price <= parseFloat(priceRange.max));

//     const matchesSearch =
//       searchTerm === "" ||
//       product.name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategories =
//       selectedCategories.length === 0 ||
//       selectedCategories.includes(product.category);

//     return inPriceRange && matchesSearch && matchesCategories;
//   };

//   const handleCardClick = (productId) => {
//     navigate(`/product/details/${productId}`);
//   };

//   const cardStyle = {
//     width: "250px",
//     marginBottom: "20px",
//     marginLeft: "30px",
//     transition: "transform 0.3s ease",
//     position: "relative",
//     cursor: "pointer",
//   };

//   const cardOverlayStyle = {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0, 0, 0, 0.5)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     opacity: 0,
//     transition: "opacity 0.3s ease",
//   };


//   const handleMouseEnter = (e) => {
//     e.currentTarget.style.transform = "scale(1.05)";
//     e.currentTarget.querySelector(".card-overlay").style.opacity = 1;
//   };

//   const handleMouseLeave = (e) => {
//     e.currentTarget.style.transform = "scale(1)";
//     e.currentTarget.querySelector(".card-overlay").style.opacity = 0;
//   };

//   const handleSnackbarClose = (reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenWishlistSnackbar(false);
//     // setOpenCartSnackbar(false);
//   };

//   const handleAddToWishlist = (product) => {
//     if (!userInfo) {
//       // User not signed in
//       alert("Please sign in to add to wishlist!");
//       return;
//     }

//     dispatch(addToWishlist(product));
//     setOpenWishlistSnackbar(true);
//   };

//   // const handleAddToCart = (product) => {

//   //   if (!userInfo) {
//   //     // User not signed in
//   //     alert("Please sign in to add to cart!");
//   //     return;
//   //   }

//   //   dispatch(addToCart(product));
//   //   setOpenCartSnackbar(true);
//   // };

//   return (
//     <Grid container spacing={isMobile ? 2 : 6}>
//       {/* Left Side: Categories Filter */}
//       <Grid item xs={12} md={3}>
//         <Paper
//           style={{
//             padding: "12px",
//             marginTop: "40px",
//             maxHeight: "calc(100vh - 120px)",
//             overflowY: "auto",
//             marginLeft: "30px",
//           }}
//         >
//           <TextField
//             label="Search Products"
//             variant="outlined"
//             margin="normal"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Typography
//             variant="subtitle1"
//             style={{
//               marginTop: "1px",
//               fontWeight: "bolder",
//               textTransform: "uppercase",
//             }}
//           >
//             Categories
//           </Typography>
//           <FormControl component="fieldset" style={{ marginTop: "10px" }}>
//             <FormGroup>
//               {categories.map((category) => (
//                 <FormControlLabel
//                   key={category._id}
//                   control={
//                     <Checkbox
//                       checked={selectedCategories.includes(category._id)}
//                       onChange={() => handleCategoryChange(category._id)}
//                       name={category.name}
//                     />
//                   }
//                   label={
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <Avatar
//                         src={`http://localhost:5005/uploads/categeory/${category.image[0]}`}
//                         alt={category.name}
//                         sx={{ marginRight: 1, width: 25, height: 25 }}
//                       />
//                       {category.name}
//                     </div>
//                   }
//                 />
//               ))}
//             </FormGroup>
//           </FormControl>
//           {/* Price Range Filter */}
//           <Typography
//             variant="subtitle1"
//             style={{
//               marginTop: "20px",
//               fontWeight: "bolder",
//               textTransform: "uppercase",
//             }}
//           >
//             Price Range
//           </Typography>
//           <div
//             style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
//           >
//             <TextField
//               label="Min"
//               variant="outlined"
//               size="small"
//               margin="dense"
//               type="number"
//               value={priceRange.min}
//               onChange={(e) => handlePriceRangeChange(e, "min")}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">$</InputAdornment>
//                 ),
//               }}
//               sx={{ mr: 1, width: 100 }}
//             />
//             <TextField
//               label="Max"
//               variant="outlined"
//               size="small"
//               margin="dense"
//               type="number"
//               value={priceRange.max}
//               onChange={(e) => handlePriceRangeChange(e, "max")}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">$</InputAdornment>
//                 ),
//               }}
//               sx={{ ml: 1, width: 100 }}
//             />
//           </div>
//         </Paper>
//       </Grid>

//       {/* Right Side: Products Display */}
//       <Grid item xs={12} md={9}>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "10px",
//             marginTop: "4%",
//           }}
//         >
//           {products
//             .filter(filterProducts)
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map((product) => (
//               <Card
//                 key={product._id}
//                 style={cardStyle}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//                  onClick={() => handleCardClick(product._id)}
//               >
//                 <CardContent>
//                   <div style={{ position: "relative" }}>
//                     <img
//                       src={`http://localhost:5005/uploads/product/${product.image[0]}`}
//                       alt={product.name}
//                       style={{
//                         maxWidth: "100%",
//                         maxHeight: "150px",
//                         marginBottom: "10px",
//                       }}
//                     />
//                     <Typography
//                       variant="h6"
//                       sx={{ textTransform: "uppercase" }}
//                     >
//                       {product.name}
//                     </Typography>
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         right: 0,
//                         display: "flex",
//                         gap: "5px",
//                         padding: "5px",
//                       }}
//                     >
//                       {product.tags.map((tag, index) => (
//                         <Chip
//                           key={index}
//                           label={tag}
//                           sx={{
//                             backgroundColor: "#0be881",
//                             fontSize: "0.75rem",
//                             color: "#ffff",
//                             fontWeight: "bolder",
//                           }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <Rating
//                       name="product-rating"
//                       value={product.ratings}
//                       precision={0.5}
//                       readOnly
//                       sx={{
//                         "& .MuiRating-iconFilled": {
//                           color: "#ffb400",
//                         },
//                       }}
//                     />
//                   </div>
//                   <Typography variant="h6"> Price: ₹{product.price}</Typography>
//                   <Typography variant="h6">Stock: {product.stock}</Typography>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginTop: "10px",
//                     }}
//                   >
                   
//                     {/* <Button
//                       startIcon={<ShoppingCart />}
//                       color="primary"
//                       size="small"
//                       style={{ fontSize: "0.75rem", padding: "4px 8px" }}
//                       onClick={() => handleAddToCart(product)}
//                     >
//                       Add Cart
//                     </Button> */}
//                   </div>

//                   <div className="card-overlay" style={cardOverlayStyle}>
//                   <Button
//                       startIcon={<FavoriteBorder />}
//                       size="small"
//                       color="error"
//                       style={{ fontSize: "0.75rem", padding: "4px 8px",color:'#ffffff' }}
//                       onClick={() => handleAddToWishlist(product)}
//                     >
//                     Add To   Wishlist
//                     </Button>

//                   </div>

//                 </CardContent>
//               </Card>
//             ))}
//         </div>
//         <Snackbar
//           open={openWishlistSnackbar}
//           autoHideDuration={6000}
//           onClose={(event, reason) => handleSnackbarClose(reason)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           TransitionComponent={Slide}
//           sx={{ height: "80px" }}
//         >
//           <Alert
//             onClose={() => handleSnackbarClose("snackbar")}
//             severity="success"
//             variant="filled"
//             sx={{
//               width: "400px",
//               backgroundColor: "#4cd137",
//               color: "#fff",
//             }}
//           >
//             Product Added to Wishlist Successfully!
//           </Alert>
//         </Snackbar>
//         {/* <Snackbar
//           open={openCartSnackbar}
//           autoHideDuration={6000}
//           onClose={(event, reason) => handleSnackbarClose(reason)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           TransitionComponent={Slide}
//           sx={{ height: "80px" }}
//         >
//           <Alert
//             onClose={() => handleSnackbarClose("snackbar")}
//             severity="success"
//             variant="filled"
//             sx={{
//               width: "400px",
//               backgroundColor: "#4cd137",
//               color: "#fff",
//             }}
//           >
//           Product  Added to Cart Successfully!
//           </Alert>
//         </Snackbar> */}
//         <TablePagination
//           rowsPerPageOptions={[6, 12, 18]}
//           count={products.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "20px", // Adjust margin as needed
//           }}
//         />
//       </Grid>
//     </Grid>
//   );
// }

// export default CustomerProduct;

