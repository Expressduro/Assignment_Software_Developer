import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/contacts");
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setSnackbar({ open: true, message: "Failed to fetch contacts", severity: "error" });
      setLoading(false);
    }
  };

  const createContact = async () => {
    if (!newContact.firstName || !newContact.lastName || !newContact.email || !newContact.phone) {
      setSnackbar({ open: true, message: "Please fill all required fields", severity: "warning" });
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/contacts", newContact);
      setContacts([...contacts, response.data]);
      setNewContact({ firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "" });
      setSnackbar({ open: true, message: "Contact created successfully!", severity: "success" });
    } catch (error) {
      console.error("Error creating contact:", error);
      setSnackbar({ open: true, message: "Failed to create contact", severity: "error" });
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      setSnackbar({ open: true, message: "Contact deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      setSnackbar({ open: true, message: "Failed to delete contact", severity: "error" });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  // Reusable TextField
  const renderTextField = (label, value, onChange) => (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Grid>
  );

  return (
    <Container>
      <h1>Contact Management</h1>

      <Grid container spacing={2}>
        {renderTextField("First Name", newContact.firstName, (val) => setNewContact({ ...newContact, firstName: val }))}
        {renderTextField("Last Name", newContact.lastName, (val) => setNewContact({ ...newContact, lastName: val }))}
        {renderTextField("Email", newContact.email, (val) => setNewContact({ ...newContact, email: val }))}
        {renderTextField("Phone", newContact.phone, (val) => setNewContact({ ...newContact, phone: val }))}
        {renderTextField("Company", newContact.company, (val) => setNewContact({ ...newContact, company: val }))}
        {renderTextField("Job Title", newContact.jobTitle, (val) => setNewContact({ ...newContact, jobTitle: val }))}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={createContact}
            disabled={!newContact.firstName || !newContact.lastName || !newContact.email || !newContact.phone} // Disable button if fields are empty
          >
            Add Contact
          </Button>
        </Grid>
      </Grid>

      <Box mt={4}>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.firstName}</TableCell>
                    <TableCell>{contact.lastName}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{contact.jobTitle}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => deleteContact(contact._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
