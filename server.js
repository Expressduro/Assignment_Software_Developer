const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/contactdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String },
  jobTitle: { type: String },
});

// Create Contact Model
const Contact = mongoose.model("Contact", contactSchema);

// **Routes**

// GET: Retrieve all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// POST: Add a new contact
app.post("/api/contacts", async (req, res) => {
  const { firstName, lastName, email, phone, company, jobTitle } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone) {
    return res
      .status(400)
      .json({ error: "First name, last name, email, and phone are required." });
  }

  try {
    const newContact = new Contact({ firstName, lastName, email, phone, company, jobTitle });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email error
      return res.status(400).json({ error: "This email already exists." });
    }
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// PUT: Update an existing contact
app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, company, jobTitle } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, company, jobTitle },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE: Remove a contact
app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
