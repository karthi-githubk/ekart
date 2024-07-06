import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  fetchUsers,
  selectUsers,
  selectUsersLoading,
} from "../../redux/slices/users/users";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EkartAdminBar from "../../navbars/EkartAdminBar";
import { Pagination, PaginationItem } from "@mui/material";


const UserControl = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("customer"); // Default to 'customer' role

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalPages = Math.ceil(
    users.filter((user) => user.role === selectedRoleFilter).length /
      rowsPerPage
  );

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (selectedUserId) {
      dispatch(deleteUser(selectedUserId));
      setDeleteConfirmationDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedUserId(null);
    setDeleteConfirmationDialogOpen(false);
  };

  const handleRoleFilterChange = (event) => {
    setSelectedRoleFilter(event.target.value);
  };

  const slicedUsers = users
  .filter((user) => user.role === selectedRoleFilter)
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <EkartAdminBar
      Content={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Paper
            elevation={3}
            style={{ padding: "16px", marginTop: "14px", width: "85%" }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              sx={{
                marginBottom: "12px",
                float: "right",
                backgroundColor: "#836FFF",
              }}
              onClick={() => navigate("/addadmin")}
            >
              Add Admin
            </Button>
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "12px", minWidth: 120 }}
            >
              <InputLabel id="role-filter-label">Filter by Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={selectedRoleFilter}
                onChange={handleRoleFilterChange}
                label="Filter by Role"
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ color: "white", backgroundColor: "black" }}
                    >
                      Sl. No
                    </TableCell>
                    <TableCell
                      style={{ color: "white", backgroundColor: "black" }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{ color: "white", backgroundColor: "black" }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      style={{ color: "white", backgroundColor: "black" }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      style={{ color: "white", backgroundColor: "black" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter((user) => user.role === selectedRoleFilter)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.role === "customer" ? (
                            <span>Actions Disabled for Customers</span>
                          ) : (
                            <>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ marginRight: 1 }}
                                onClick={() =>
                                  navigate(`/ekart/users/edit/${user._id}`)
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ marginLeft: 1 }}
                                onClick={() => handleDeleteClick(user._id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "orange",
                        color: "white",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "darkorange",
                      },
                    }}
                  />
                )}
              />
            </Box>
            </TableContainer>
            <Dialog
              open={deleteConfirmationDialogOpen}
              onClose={handleDeleteCancel}
            >
              <DialogTitle>Delete User</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this user?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button onClick={handleDeleteConfirmation} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </div>
      }
    />
  );
};

export default UserControl;
