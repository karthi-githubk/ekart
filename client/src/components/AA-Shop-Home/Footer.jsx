import React from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerQuickLinks = [
    {
      display: "Home",
      url: "/",
    },
    {
      display: "Products",
      url: "/products",
    },
    {
      display: "Contact",
      url: "/contact",
    },
  ];

  return (
    <footer className="footer" style={{ backgroundColor: "#282c34", padding: "20px 0", color: "white" }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} className="mb-5">
            <div className="follows">
              <Typography variant="body1" className="mb-0" style={{ fontSize: '13px' }}>Follow us on social media</Typography>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <a href="http://www.ekartlogistics.com/">
                  <Facebook sx={{
                    fontSize: 30,
                    color: 'white',
                    "&:hover": {
                      color: "#3b5998",
                    },
                  }} />
                </a>
                <a href="http://www.ekartlogistics.com/">
                  <Instagram sx={{
                    fontSize: 30,
                    color: 'white',
                    "&:hover": { color: "#fd5d93" }
                  }} />
                </a>
                <a href="http://www.ekartlogistics.com/">
                  <LinkedIn sx={{
                    fontSize: 30,
                    color: 'white',
                    "&:hover": { color: '#0072b1' }
                  }} />
                </a>
                <a href="http://www.ekartlogistics.com/">
                  <Twitter sx={{
                    fontSize: 30,
                    color: 'white',
                    "&:hover": { color: '#00acee' }
                  }} />
                </a>
              </div>
            </div>
          </Grid>

          <Grid item lg={4} md={6} className="mb-4">
            <Typography variant="h6" className="fw-bold" style={{ fontSize: '15px' }}>Quick Links</Typography>
            <List className="link__list" >
              {footerQuickLinks.map((item, index) => (
                <ListItem key={index} disablePadding className="border-0 ps-0 link__item">
                  <ListItemText className="links" primary={<Link to={item.url} style={{ fontSize: '13px', color: 'white',textDecoration:'none' }}>{item.display}</Link>} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item lg={4} md={6}>
            <Typography variant="h6" className="fw-bold" style={{ fontSize: '15px' }}>eKart</Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon style={{ color: "white", fontSize: '22px', marginRight: '5px' }} />
              <span style={{ color: "white" }}>123 Fake Street, Springfield</span>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              <PhoneIcon style={{ color: "white", fontSize: '22px', marginRight: '5px' }} />
              <span style={{ color: "white" }}>Phone: +91 1234567890</span>
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              <EmailIcon style={{ color: "white", fontSize: '20px', marginRight: '5px' }} />
              <span style={{ color: "white" }}>Email: ekart@gmail.com</span>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
