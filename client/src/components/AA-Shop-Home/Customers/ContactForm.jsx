import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Paper, Grid, TextField, Button, Typography, Snackbar, Alert, Slide, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContactImage from "../../images/contact.jpg"; // Replace with your image path
import { createContact } from "../../redux/slices/contact/contact";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string().required("Phone Number is required"),
  message: Yup.string().required("Message is required"),
});

const ContactForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createContact(values)).then(() => {
        setOpenSnackbar(true);
      });
    },
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container spacing={3}>
        {/* Contact Image */}
        <Grid item xs={12} md={6}mt={5}>
          <img src={ContactImage} alt="Contact" style={{ width: "100%", height: "350px" ,borderRadius:'4px'}} />
        </Grid>
        
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px", maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom sx={{textAlign:'center', fontFamily:'Poppins',fontWeight:'bolder'}}>
              Contact Us
            </Typography>
            <form onSubmit={formik.handleSubmit}>
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
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={4}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth type="submit" variant="contained" color="primary">
                    Send
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
          >
            <Alert severity="success" onClose={handleSnackbarClose} sx={{ width: "100%" }}>
              Message sent successfully!
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactForm;
