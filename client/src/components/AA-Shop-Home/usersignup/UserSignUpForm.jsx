import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAppDispatch } from "../../redux/hooks/";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../redux/slices/users/users";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";

const UserSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup.string().required("Phone Number is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);

      try {
        await dispatch(createUser(formData));
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "Your account has been created successfully!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message || "An error occurred while creating your account.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('data:image/jpeg;base64,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')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "95vh" }}
        >
          <Paper style={{ maxWidth: 410, padding: 10, margin: "0 auto" }}>
            <CancelIcon variant="outlined" onClick={() => navigate("/")} sx={{color:'#f53b57'}} />

            <Typography
              variant="h6"
              sx={{ textAlign: "center", textTransform: "uppercase" }}
            >
              Create An Account
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
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Button
                    id="signup-submit"
                    variant="contained"
                    type="submit"
                    fullWidth
                  >
                    Create Account
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};

export default UserSignUp;
