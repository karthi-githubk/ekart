import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  textAlign:'center',
  margin: '0 10px', 
  '&.active': {
    backgroundColor: 'orange',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white', 
    '& span': {
      color: 'white', 
      fontWeight:500,
    },
  },
}));

export default function Subnav() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginLeft:'12px'}} />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav style={{marginTop:'18px'}}>
          <StyledNavLink to="/" exact>
            <Nav.Link as="span">Home</Nav.Link>
          </StyledNavLink>
          <StyledNavLink to="/products">
            <Nav.Link as="span">Products</Nav.Link>
          </StyledNavLink>
          <StyledNavLink to="/contact">
            <Nav.Link as="span">Contact</Nav.Link>
          </StyledNavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
