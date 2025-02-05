const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db/db");
const Company = require("./models/companySchema");
const JoinedCompany = require("./models/joincompanies"); // New schema for joined companies

connectDB();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes

// Submit company form
app.post("/api/sell", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json({ message: "Company information saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving company information", details: error });
  }
});

// Get all companies
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching company data" });
  }
});

// Update company information using phone number
app.put("/api/companies/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const updatedCompany = await Company.findOneAndUpdate({ phone }, req.body, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found with the given phone number" });
    }

    res.status(200).json({ message: "Company information updated successfully", company: updatedCompany });
  } catch (error) {
    res.status(500).json({ error: "Error updating company information", details: error });
  }
});

// Delete a company
app.delete("/api/companies/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const deletedCompany = await Company.findOneAndDelete({ phone });

    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting company", details: error });
  }
});

// Add company to 'Join Companies'
app.post("/api/joinCompanies", async (req, res) => {
  try {
    const newJoinedCompany = new JoinedCompany(req.body);
    await newJoinedCompany.save();
    res.status(201).json({ message: "Company added to join companies successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding company to join companies", details: error });
  }
});

// Get all joined companies
app.get("/api/joinCompanies", async (req, res) => {
  try {
    const joinedCompanies = await JoinedCompany.find();
    res.json(joinedCompanies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching joined companies data" });
  }
});

// Delete a joined company
app.delete("/api/joinCompanies/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const deletedJoinedCompany = await JoinedCompany.findOneAndDelete({ phone });

    if (!deletedJoinedCompany) {
      return res.status(404).json({ error: "Joined company not found" });
    }

    res.status(200).json({ message: "Joined company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting joined company", details: error });
  }
});

// Update joined company information using phone number
app.put("/api/joinCompanies/:phone", async (req, res) => {
  try {
    const { phone } = req.params; // Extract the phone number from the request parameters
    const updatedJoinedCompany = await JoinedCompany.findOneAndUpdate(
      { phone }, // Find the company by its phone number
      req.body,  // Update with the request body
      { new: true } // Return the updated document
    );

    if (!updatedJoinedCompany) {
      return res.status(404).json({ error: "Joined company not found with the given phone number" });
    }

    res.status(200).json({
      message: "Joined company information updated successfully",
      company: updatedJoinedCompany,
    });
  } catch (error) {
    console.error("Error updating joined company:", error);
    res.status(500).json({ error: "Error updating joined company", details: error });
  }
});


// Verify GST
app.post("/api/verify-gst", async (req, res) => {
  const { gstin } = req.body;

  if (!gstin) {
    return res.status(400).json({ error: "GSTIN is required" });
  }

  try {
    const apiKey = "9e7eed7db40a3b5a8a77895ab62ba707"; // Replace with your actual API key
    const url = `http://sheet.gstincheck.co.in/check/${apiKey}/${gstin}`;

    const response = await axios.get(url);

    // Check if the API response is successful
    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: "Invalid GSTIN or API issue", details: response.data });
    }
  } catch (error) {
    console.error("Error in verifying GST:", error.response?.data || error.message);
    res.status(500).json({
      error: "Error verifying GST",
      details: error.response?.data || error.message
    });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
