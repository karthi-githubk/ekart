import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Slide,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

import { useDropzone } from "react-dropzone";
import EkartAdminBar from "../navbars/EkartAdminBar";
import { createProduct, resetProducts } from "../redux/slices/product/product";
import {
  fetchCategories,
  selectCategories,
} from "../redux/slices/category/category";

const validationSchema = Yup.object().shape({
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
  tags: Yup.string().required("Tag is required"),
});

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.products);
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);

  const categories = useSelector(selectCategories);

  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      name: "",
      description: "",
      image: null,
      category: "",
      price: "",
      stock: "",
      ratings: "",
      tags: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("ratings", values.ratings);
      formData.append("tags", values.tags);
      dispatch(createProduct(formData));
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/ekart/products");
        dispatch(resetProducts());
      }, 3000);
    }
  }, [isSuccess, dispatch, navigate]);

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
          <div>
            <Link to="/ekart/products">
              <Button
                variant="contained"
                color="error"
                style={{ marginBottom: "14px" }}
                startIcon={<ReplyAllIcon />}
              >
                Go Back
              </Button>
            </Link>

            <Paper elevation={3} style={{ padding: "20px", maxWidth: 900 }}>
              <Typography variant="h5" gutterBottom>
                Product Form
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="category"
                      options={categories}
                      getOptionLabel={(category) => category.name}
                      value={
                        categories.find(
                          (category) => category._id === formik.values.category
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        formik.setFieldValue("category", newValue?._id || "");
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
                            formik.touched.category && formik.errors.category
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Product Description"
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price"
                      id="price"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Stock"
                      id="stock"
                      name="stock"
                      type="number"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.stock && Boolean(formik.errors.stock)
                      }
                      helperText={formik.touched.stock && formik.errors.stock}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ratings"
                      id="ratings"
                      name="ratings"
                      type="number"
                      value={formik.values.ratings}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.ratings && Boolean(formik.errors.ratings)
                      }
                      helperText={formik.touched.ratings && formik.errors.ratings}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tags"
                      id="tags"
                      name="tags"
                      value={formik.values.tags}
                      onChange={formik.handleChange}
                      variant="outlined"
                    
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
                        {(formik.touched.image && formik.errors.image) || " "}
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

                  <Grid item xs={12}>
                    {selectedImageNames.length > 0 && (
                      <Typography variant="body1">
                        Selected images: {selectedImageNames.join(", ")}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Add Product
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
                severity="success"
                variant="filled"
                sx={{
                  width: "400px",
                  backgroundColor: "#4cd137",
                  color: "#fff",
                }}
              >
                Product Added Successfully!
              </Alert>
            </Snackbar>
          </div>
        </Grid>
      }
    />
  );
};

export default AddProduct;
