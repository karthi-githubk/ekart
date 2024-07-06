awwwwimport React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Avatar,
  Pagination,
  PaginationItem,
  Rating,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchProducts,
  selectProducts,
} from "../../redux/slices/product/product";

function CustomerProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 2 : 6);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setPage(1); // Reset page number when filters change
  }, [selectedCategory, searchTerm, priceRange]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === categoryId ? null : categoryId
    );
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

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    return inPriceRange && matchesSearch && matchesCategory;
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
    cursor: "pointer",
  };

  const cardOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.querySelector(".card-overlay").style.opacity = 1;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.querySelector(".card-overlay").style.opacity = 0;
  };


  const filteredProducts = products.filter(filterProducts);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const slicedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

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
                      checked={selectedCategory === category._id}
                      onChange={() => handleCategoryChange(category._id)}
                      name={category.name}
                    />
                  }
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={`https://ekart-57l0.onrender.com/uploads/categeory/${category.image[0]}`}
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
                  <InputAdornment position="start">₹</InputAdornment>
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
                  <InputAdornment position="start">₹</InputAdornment>
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
          {slicedProducts.map((product) => (
            <Card
              key={product._id}
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleCardClick(product._id)}
            >
              <CardContent>
                <div style={{ position: "relative" }}>
                  <img
                    src={`https://ekart-57l0.onrender.com/uploads/product/${product.image[0]}`}
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
                          backgroundColor: "#0be881",
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
                <div>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    ₹{product.price}
                  </Typography>
                </div>
                <div
                  className="card-overlay"
                  style={cardOverlayStyle}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    View Details
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Box
          mt={2}
          display="flex"
          justifyContent="center"
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            renderItem={(item) => (
              <PaginationItem {...item}
              
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "orange",
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "darkorange",
                },
              }}/>
            )}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default CustomerProduct;
