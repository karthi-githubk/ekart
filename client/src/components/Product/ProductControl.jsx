import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import EkartAdminBar from "../navbars/EkartAdminBar";

import {
  fetchProducts,
  deleteProduct,
  selectProducts,
  updateProducts,
  selectProductsLoading,
} from "../redux/slices/product/product";
import {
  fetchCategories,
  selectCategories,
} from "../redux/slices/category/category";

function ProductControl() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct(productToDelete));

    const updatedProducts = products.filter(
      (product) => product._id !== productToDelete
    );
    dispatch(updateProducts(updatedProducts));

    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateDescription = (description, maxLength) => {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  return (
    <EkartAdminBar
      Content={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              marginLeft: "auto",
              backgroundColor: "#836FFF",
            }}
            onClick={() => navigate("/ekart/addproduct")}
          >
            Add Product
          </Button>
          <Typography
            variant="h4"
            sx={{ marginBottom: "15px", fontWeight: 500 }}
          >
            Products
          </Typography>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => {
                // Find the category object by ID
                const category = categories.find(
                  (cat) => cat._id === product.category
                );

                return (
                  <Card
                    key={product._id}
                    style={{ width: "320px", margin: "10px" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ textTransform: "uppercase" }}
                      >
                        Category: {category ? category.name : "Unknown"}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ textTransform: "uppercase" }}
                      >
                        Product Name: {product.name}
                      </Typography>
                      <img
                        src={`http://localhost:5005/uploads/product/${product.image[0]}`}
                        alt={product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          marginBottom: "10px",
                        }}
                      />

                      <Typography variant="body2">
                        Price: {product.price}
                      </Typography>
                      <Typography variant="body2">
                        Stock: {product.stock}
                      </Typography>

                      {/* Additional fields */}
                      <Typography variant="body1">
                        Description:{" "}
                        {expanded
                          ? product.description
                          : truncateDescription(product.description, 50)}
                      </Typography>
                      {product.description.length > 50 && (
                        <Button onClick={() => setExpanded(!expanded)}>
                          {expanded ? "Show less" : "Show more"}
                        </Button>
                      )}
                      <Typography variant="body2">
                        Ratings: {product.ratings}
                      </Typography>
                      <div>
                        Tags:{" "}
                        {product.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            avatar={<Avatar>#</Avatar>}
                            sx={{ marginRight: 1 }}
                          />
                        ))}
                      </div>

                      <div style={{ marginTop: "10px" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          sx={{ marginRight: 1 }}
                          onClick={() =>
                            navigate(`/ekart/product/edit/${product._id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          sx={{ marginLeft: 1 }}
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          <TablePagination
            rowsPerPageOptions={[4, 8, 16]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this product?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      }
    />
  );
}

export default ProductControl;
