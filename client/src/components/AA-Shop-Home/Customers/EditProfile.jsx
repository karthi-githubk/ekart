import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Typography,
  IconButton,
  Alert,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUserById, editUser } from "../../redux/slices/users/users";
import { useDropzone } from "react-dropzone";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roleOptions = ["admin", "super_admin"];
  const [previousImage, setPreviousImage] = useState("");
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
        setSelectedImage(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    phone: yup.string().required("Phone Number is required"),
    password: yup.string().required("Password is required"),
    role: yup.string().required("Role is required"),
    image: yup
      .mixed()
      .test("fileSize", "Image file size too large", (value) => {
        if (!value) return true; // No file selected, validation passed
        return value.size <= 1024 * 1024; // 1MB
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("role", values.role);
      if (values.image) {
        formData.append("image", values.image);
      }

      dispatch(editUser({ id, updatedUser: formData })).then(() => {
        navigate("/"); 
      });
    },
  });

  const userData = useAppSelector((state) =>
    state.users.users.find((user) => user._id === id)
  );

  useEffect(() => {
    // Fetch user data if editing an existing user
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Set form values when user data is available
    if (userData) {
      formik.setValues({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
      });
      if (userData.image && userData.image.length > 0) {
        setPreviousImage(userData.image[0]);
        setSelectedImageNames([userData.image]);
      }
    }
  }, [userData]);

  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ marginTop:'24px' }}
      >
        <Paper style={{ maxWidth: 710, padding: 6, margin: "0 auto" }}>
          <Typography variant="h6" sx={{ textAlign: "center", textTransform: "uppercase" }}>
            Edit Profile
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ padding: "25px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="signup-password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    // Add InputProps to append visibility toggle icon
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
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
                  <input {...getInputProps()} />
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {previousImage && !formik.values.image && (
                      <>
                        <Typography variant="body1">
                          Previous Image: {previousImage}
                        </Typography>

                        <Avatar
                          alt="Previous Profile"
                          src={`http://localhost:5005/uploads/users/${previousImage}`}
                          style={{ width: 100, height: 100, marginBottom: 10 }}
                        />
                      </>
                    )}
                    {formik.values.image && (
                      <>
                        <Typography
                          variant="body1"
                          style={{ marginTop: "10px" }}
                        >
                          Selected Image: {formik.values.image.name}
                        </Typography>
                        <Avatar
                          alt="Profile Image"
                          src={URL.createObjectURL(formik.values.image)}
                          style={{ width: 100, height: 100, marginBottom: 10 }}
                        />
                      </>
                    )}
                    {!previousImage && !formik.values.image && (
                      <Typography variant="caption">
                        Drag 'n' drop some images here, or click to select
                        Profile image
                      </Typography>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  id="update-submit"
                  variant="contained"
                  type="submit"
                  fullWidth
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Container>
  );
};

export default EditProfile;
