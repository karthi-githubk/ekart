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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import {
  createCategory,
  resetCategories,
} from "../redux/slices/category/category";
import { useDropzone } from "react-dropzone";
import EkartAdminBar from "../navbars/EkartAdminBar";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
  description: Yup.string().required("Category Description is required"),
  image: Yup.mixed().required("Image is required"),
});

const CategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.categories);
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);
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
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image);

      dispatch(createCategory(formData));
    },
  });

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/category");
        dispatch(resetCategories());
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
            <Link to="/category">
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
                Category Form
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Category Name"
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
                      label="Category Description"
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
                      Add Category
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
                Category Added Successfully!
              </Alert>
            </Snackbar>
          </div>
        </Grid>
      }
    />
  );
};

export default CategoryForm;
