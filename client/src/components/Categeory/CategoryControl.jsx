import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  deleteCategory,
  fetchCategories,
  selectCategories,
  updateCategories,
} from "../redux/slices/category/category";
import { useNavigate } from "react-router-dom";
import EkartAdminBar from "../navbars/EkartAdminBar";

function CategoryControl() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteCategory = (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCategory(categoryToDelete));
    const updatedCategories = categories.filter(
      (category) => category._id !== categoryToDelete
    );
    dispatch(updateCategories(updatedCategories));
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateDescription = (description, maxLength) => {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  const toggleExpand = (categoryId) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId
    );
  };

  return (
    <EkartAdminBar
      Content={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              marginLeft: "auto",
              backgroundColor: "#836FFF",
            }}
            onClick={() => navigate("/ekart/addcategeory")}
          >
            Add Category
          </Button>
          <Typography
            variant="h4"
            sx={{ marginBottom: "15px", fontWeight: 500 }}
          >
            Categories
          </Typography>

          <Paper elevation={3} style={{ padding: "2px",  }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {categories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <Card
                    key={category._id}
                    style={{ width: "300px", margin: "10px" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {category.name}
                      </Typography>
                      <img
                        src={`http://localhost:5005/uploads/categeory/${category.image[0]}`}
                        alt={category.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography variant="body1">
                        Description:{" "}
                        {expandedCategoryId === category._id
                          ? category.description
                          : truncateDescription(category.description, 50)}
                      </Typography>
                      {category.description.length > 50 && (
                        <Button onClick={() => toggleExpand(category._id)}>
                          {expandedCategoryId === category._id
                            ? "Show less"
                            : "Show more"}
                        </Button>
                      )}
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          sx={{ marginRight: 1 }}
                          onClick={() =>
                            navigate(`/ekart/categeory/edit/${category._id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          sx={{ marginLeft: 1 }}
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <TablePagination
              rowsPerPageOptions={[4, 8, 16]}
              component="div"
              count={categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this category?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      }
    />
  );
}

export default CategoryControl;
