import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUserById, editUser } from "../../redux/slices/users/users";
import EkartAdminBar from "../../navbars/EkartAdminBar";

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roleOptions = ["admin", "super_admin"];

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    phone: yup.string().required("Phone Number is required"),
    password: yup.string().required("Password is required"),
    role: yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const updatedUserData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      };
      dispatch(editUser({ id, updatedUser: updatedUserData })).then(() => {
        navigate("/ekart/users"); // Redirect to success page or handle success
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
    }
  }, [userData]);

  return (
    <EkartAdminBar
      Content={
        <Container>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "95vh" }}
          >
            <Paper style={{ maxWidth: 710, padding: 10, margin: "0 auto" }}>
              <Typography variant="h6" sx={{ textAlign: "center", textTransform: "uppercase" }}>
                Edit User
              </Typography>
              <form onSubmit={formik.handleSubmit} style={{ padding: "25px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="role"
                      name="role"
                      options={roleOptions}
                      value={formik.values.role}
                      onChange={(_, newValue) => {
                        formik.setFieldValue("role", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label="Select Role"
                          error={formik.touched.role && Boolean(formik.errors.role)}
                          helperText={formik.touched.role && formik.errors.role}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      id="update-submit"
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      Update User
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>
      }
    />
  );
};

export default EditUserForm;
