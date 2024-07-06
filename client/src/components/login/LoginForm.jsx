import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Link,
  Alert,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import logo from "../images/login-img.png";
import { useAppDispatch, useAppSelector } from "../redux/hooks/index";
import { postSignIn } from "../redux/slices/user/signin";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCookies } from "react-cookie";
import CancelIcon from '@mui/icons-material/Cancel';


const LoginForm = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSignIn.user);
  const token = useAppSelector((state) => state.userSignIn.token);
  const error = useAppSelector((state) => state.userSignIn.error);
  const success = useAppSelector((state) => state.userSignIn.selectSuccess);
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["token"]);
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    if (token !== "") {
      setCookie("token", token);
    }
  }, [token]);

 
  const handleRoleBasedRouting = (userRole) => {
    if (userRole === "admin") {
      navigate("/ekart/admin/dashboard");
    } else if (userRole === "customer") {
      navigate("/");
    } else {
      navigate("/"); 
    }
  };
  

  const validationSchema = yup.object({
    email: yup.string("Enter your email").required("Email is required"),
    password: yup.string("Enter your password").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await dispatch(postSignIn(values));

    
      const userRole = user?.role;

      if (userRole) {
        // Call the function for role-based routing
        handleRoleBasedRouting(userRole);
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
      <Container maxWidth="lg">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "95vh" }}
        >
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="170"
              image={logo}
              alt="Login Background"
            />
            <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            Login
          </Typography>

       <Button 
   
            startIcon={<CancelIcon />}
      onClick={() => navigate('/')}
      sx={{backgroundColor:'#f53b57',color:'#ffff'}}
    >
      cancel
    </Button>
        </Box>
              <form
                onSubmit={formik.handleSubmit}
                style={{ width: "100%", marginTop: 2 }}
              >
                <TextField
                  fullWidth
                  id="signin-email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                  data-test="email-input"
                />
                <TextField
                  fullWidth
                  id="signin-password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  data-test="Password-input"
                />

                {error && (
                  <div style={{ marginBottom: "3px", marginTop: "12px" }}>
                    <Alert severity="error">{error.value}</Alert>
                  </div>
                )}

                {success && (
                  <div style={{ marginBottom: "3px", marginTop: "12px" }}>
                    <Alert severity="success">{success.value}</Alert>
                  </div>
                )}

                <Button
                  id="signin-submit"
                  variant="contained"
                  type="submit"
                  fullWidth
                  data-test="submit-button"
                  sx={{ marginTop: "12px" }}
                >
                  Login
                </Button>
              </form>
              <Link href="user_signup" variant="body1" mt={3} mb={3}>
                Don't Have An Account? SignUp
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </div>
  );
};

export default LoginForm;
