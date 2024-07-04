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

import { useNavigate } from "react-router-dom";
import EkartAdminBar from "../navbars/EkartAdminBar";
import { deleteContact, fetchContacts, selectContacts } from "../redux/slices/contact/contact";

function ContactControl() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector(selectContacts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleDeleteContact = (id) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteContact(contactToDelete));
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setContactToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleExpandMessage = (id) => {
    setExpandedMessageId(
      expandedMessageId === id ? null : id
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
          
          <Typography
            variant="h4"
            sx={{ marginBottom: "15px", fontWeight: 500 }}
          >
            Enquirys
          </Typography>

          <Paper elevation={3} style={{ padding: "2px" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => (
                  <Card
                    key={contact._id}
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
                        {contact.name}
                      </Typography>
                      <Typography variant="h6">
                        Email: {contact.email}
                      </Typography>
                      <Typography variant="h6">
                        Phone: {contact.phone}
                      </Typography>
                      <Typography variant="h6">
                        Message:{" "}
                        {expandedMessageId === contact._id
                          ? contact.message
                          : `${contact.message.substring(0, 50)}...`}
                      </Typography>
                      {contact.message.length > 50 && (
                        <Button onClick={() => toggleExpandMessage(contact._id)}>
                          {expandedMessageId === contact._id ? "Show less" : "Show more"}
                        </Button>
                      )}
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          sx={{ marginLeft: 1 }}
                          onClick={() => handleDeleteContact(contact._id)}
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
              count={contacts.length}
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
                Are you sure you want to delete this contact?
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

export default ContactControl;
