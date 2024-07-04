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
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import {
  fetchCategoryById,
  resetCategories,
  editCategory,
} from "../redux/slices/category/category";
import EkartAdminBar from "../navbars/EkartAdminBar";

const CategoryEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccess = useSelector((state) => state.categories.isSuccess);
  const selectedCategory = useSelector((state) =>
    state.categories.categories.find((category) => category._id === id)
  );
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Category description is required"),
    image: Yup.mixed().required("Image is required"),
   
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
      name: selectedCategory?.name || "",
      description: selectedCategory?.description || "",
    
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      try {
        await dispatch(editCategory({ id, updatedCategory: values }));
        resetForm();
        handleSnackbarOpen("success", "Category updated successfully!");
      } catch (error) {
        console.error("Error updating category:", error);
        handleSnackbarOpen("error", "Failed to update category");
      }
    },
  });

  useEffect(() => {
    dispatch(fetchCategoryById(id));
   
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCategory) {
    
     
  
      formik.setValues({
        name: selectedCategory.name,
        description: selectedCategory.description,
        image: selectedCategory.image || null,
      
      });
  
     
      setSelectedImageNames([selectedCategory.image]);
    }
  }, [selectedCategory,]);
  

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();

      setTimeout(() => {
        navigate("/category");
        dispatch(resetCategories());
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
              Edit Category
            </Typography>
            <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
              

                <Grid item xs={12}>
                  <TextField
                    label="Category Name"
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
                    label="Category Description"
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
                      formik.touched.description && formik.errors.description
                    }
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

                <Grid item xs={6}>
                  <Button variant="contained" color="primary" type="submit">
                    Update Category
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

export default CategoryEditForm;
