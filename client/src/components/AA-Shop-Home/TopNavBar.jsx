import React from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Badge from "@mui/material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import logo from "./../images/cart.jpg";
import { useNavigate } from "react-router-dom";
import Subnav from "./Subnav";
import { selectWishlist } from "../redux/slices/Items/wishlist";
import { selectCartItems } from "../redux/slices/Items/cart";
import { useCookies } from "react-cookie";
import { resetSignIn, selectUserInfo } from "../redux/slices/user/signin";

function TopNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const wishlist = useSelector(selectWishlist);
  const cartItems = useSelector(selectCartItems);
  const [cookies, removeCookie] = useCookies(["token"]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCustomerLoginClick = () => {
    handleCloseNavMenu();
    navigate("/login");
  };

 
  const handleLogout = () => {
    handleCloseNavMenu();
    removeCookie("token", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    dispatch(resetSignIn());
    navigate("/");
  };

  return (
    <div>
      <AppBar position="static" className="app-bar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "40px", width: "120px" }}
              />
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "40px", width: "100px" }}
              />
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex" }}>
              {!userInfo ? (
                <Tooltip title="Login">
                  <IconButton
                    onClick={handleCustomerLoginClick}
                    sx={{ p: 0, mr: 2 }}
                  >
                    <Typography sx={{ color: "white", fontWeight: "bold" }}>
                      Login
                    </Typography>
                    <AccountCircleIcon style={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  <Tooltip title="Wishlist">
                    <IconButton
                      sx={{ p: 0, mr: 2 }}
                      onClick={() => navigate(`/wishlist`)}
                    >
                      <Badge badgeContent={wishlist.length} color="secondary">
                        <FavoriteIcon style={{ color: "white" }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cart">
                    <IconButton
                      sx={{ p: 0, mr: 2 }}
                      onClick={() => navigate(`/cart`)}
                    >
                      <Badge badgeContent={cartItems.length} color="secondary">
                        <ShoppingCartIcon style={{ color: "white" }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, border: "3px solid white" }}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={`http://localhost:5005/uploads/users/${userInfo?.user?.image[0]}`}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      onClick={() =>
                        navigate(`/edit/profile/${userInfo?.user?._id}`)
                      }
                    >
                      <AccountCircleIcon fontSize="small" />
                      Edit Profile
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                      <Logout fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Subnav />
    </div>
  );
}

export default TopNavBar;
