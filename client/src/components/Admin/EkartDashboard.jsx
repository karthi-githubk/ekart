import { Typography, Card, CardContent, Grid } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";
import BadgeIcon from "@mui/icons-material/Badge";
import CategoryIcon from "@mui/icons-material/Category";
import { Link } from "react-router-dom";
import EkartAdminBar from "../navbars/EkartAdminBar";
import { fetchUsers, selectUsers } from "../redux/slices/users/users";
import {
  fetchCategories,
  selectCategories,
} from "../redux/slices/category/category";
import { fetchProducts, selectProducts } from "../redux/slices/product/product";

const EkartDashboard = () => {
  const dispatch = useDispatch();
  const totalUsers = useSelector(selectUsers);
  const totalProducts = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <EkartAdminBar
        Content={
          <>
            <Grid container spacing={2} mt={2}>
              {/* Users Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GroupIcon sx={{ fontSize: "54px", color: "#836FFF" }} />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontSize: "24px", marginLeft: "12px" }}
                    >
                      Users:{" "}
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", fontSize: "42px" }}
                      >
                        {totalUsers.length}
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Tasks Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TaskIcon sx={{ fontSize: "54px", color: "#836FFF" }} />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontSize: "24px", marginLeft: "12px" }}
                    >
                     Products:{" "}
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", fontSize: "42px" }}
                      >
                        {totalProducts.length}{" "}
                        {/* Assuming totalProducts is an array */}
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Categories Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Icon representing categories */}
                    <CategoryIcon sx={{ fontSize: "54px", color: "#836FFF" }} />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontSize: "24px", marginLeft: "12px" }}
                    >
                     Categories: 
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", fontSize: "42px" }}
                      >
                        {categories.length}
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        }
      />
    </>
  );
};

export default EkartDashboard;
