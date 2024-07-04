import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Slide,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Autocomplete from "@mui/material/Autocomplete";

import {
  fetchProductById,
  resetProducts,
  editProduct,
} from "../redux/slices/product/product";
import EkartAdminBar from "../navbars/EkartAdminBar";
import { fetchCategories, selectCategories } from "../redux/slices/category/category";

const ProductEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const isSuccess = useSelector((state) => state.products.isSuccess);
  const selectedProduct = useSelector((state) =>
    state.products.products.find((product) => product._id === id)
  );
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Product Name is required"),
    description: Yup.string().required("Product Description is required"),
    image: Yup.mixed().required("Image is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    ratings: Yup.number()
      .required("Rating is required")
      .min(0, "Rating must be between 0 and 5")
      .max(5, "Rating must be between 0 and 5"),
      tags: Yup.array()
      .of(Yup.string())
      .required("At least one tag is required"),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpeg, image/jpg, image/jpeg",
    onDrop: (acceptedFiles) => {
      const isImageValid = acceptedFiles.every(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
      );

      if (!isImageValid) {
        setFileTypeError("Only PNG, JPG, or JPEG files are allowed");
      } else {
        setFileTypeError("");
        formik.setFieldValue("image", acceptedFiles[0]);
        const names = acceptedFiles.map((file) => file.name);
        setSelectedImageNames(names);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      name: selectedProduct?.name || "",
      description: selectedProduct?.description || "",
      image: selectedProduct?.image || null,
      category: selectedProduct?.category || "",
      price: selectedProduct?.price || "",
      stock: selectedProduct?.stock || "",
      ratings: selectedProduct?.ratings || "",
      tags: selectedProduct?.tags || "",
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(editProduct({ id, updatedProduct: values }));
        resetForm();
        handleSnackbarOpen("success", "Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        handleSnackbarOpen("error", "Failed to update product");
      }
    },
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      formik.setValues({
        name: selectedProduct.name,
        description: selectedProduct.description,
        image: selectedProduct.image || null,
        category: selectedProduct.category || "",
        price: selectedProduct.price || "",
        stock: selectedProduct.stock || "",
        ratings: selectedProduct.ratings || "",
        tags: selectedProduct.tags || "",
      });

      setSelectedImageNames([selectedProduct.image]);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/ekart/products");
        dispatch(resetProducts());
      }, 3000);
    }
  }, [isSuccess, dispatch, navigate]);

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <EkartAdminBar
      Content={
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "40px" }}
        >
          <Paper elevation={3} style={{ padding: "20px", maxWidth: 900 }}>
            <Typography variant="h5" gutterBottom sx={{ padding: 1 }}>
              Edit Product
            </Typography>
            <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                  <Autocomplete
                    id="category"
                    options={categories}
                    getOptionLabel={(category) => category.name}
                    value={
                      categories.find(
                        (category) =>
                          category._id === formik.values.category
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      formik.setFieldValue(
                        "category",
                        newValue ? newValue._id || "" : ""
                      );
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Select Category"
                        error={
                          formik.touched.category &&
                          Boolean(formik.errors.category)
                        }
                        helperText={
                          formik.touched.category &&
                          formik.errors.category
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Product Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description &&
                      formik.errors.description
                    }
                  />
                </Grid>
             
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Stock"
                    variant="outlined"
                    fullWidth
                    name="stock"
                    type="number"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                    helperText={formik.touched.stock && formik.errors.stock}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ratings"
                    variant="outlined"
                    fullWidth
                    name="ratings"
                    type="number"
                    value={formik.values.ratings}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.ratings &&
                      Boolean(formik.errors.ratings)
                    }
                    helperText={formik.touched.ratings && formik.errors.ratings}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tags"
                    variant="outlined"
                    fullWidth
                    name="tags"
                    value={formik.values.tags}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tags && Boolean(formik.errors.tags)}
                    helperText={formik.touched.tags && formik.errors.tags}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #ccc",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <input {...getInputProps()} data-test="image-input" />
                    <Typography color="textSecondary" variant="caption">
                      {fileTypeError}
                    </Typography>
                    <Typography color="error" variant="caption">
                      {formik.touched.image && formik.errors.image}
                    </Typography>
                    {fileTypeError && (
                      <Alert severity="error" style={{ marginTop: "8px" }}>
                        {fileTypeError}
                      </Alert>
                    )}
                    <div>
                      {selectedImageNames.length > 0 ? (
                        <Typography variant="body1">
                          Selected images: {selectedImageNames.join(", ")}
                        </Typography>
                      ) : (
                        <Typography variant="caption">
                          Drag 'n' drop some images here, or click to select
                          images
                        </Typography>
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" type="submit">
                    Update Product
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
            sx={{ height: "80px" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{
                width: "400px",
                backgroundColor:
                  snackbarSeverity === "success" ? "#4cd137" : "#e44d26",
                color: "#fff",
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
      }
    />
  );
};

export default ProductEditForm;
