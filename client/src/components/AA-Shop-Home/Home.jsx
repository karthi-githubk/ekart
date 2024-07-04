import React from 'react';
import { Grid, Typography, Container } from '@mui/material';
import logo from './../images/banner-img.jpg';


const styles = {
  root: {
    flexGrow: 1,
    marginTop: '16px',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '16px',
  },
};

const Hero = () => {
  return (
    <Container style={styles.root}>
      <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
          <div style={styles.textContainer}>
            <Typography variant="h3" gutterBottom>
              Discover Your Perfect Shopping Experience
            </Typography>
            <Typography variant="body1" sx={{fontWeight:600,letterSpacing:'2px'}}>
              Explore our wide range of products and find everything you need for your next shopping adventure. Whether it's fashion, electronics, or home essentials, we've got you covered.
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            style={styles.image}
            src={logo}
            alt="Hero"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Hero;
