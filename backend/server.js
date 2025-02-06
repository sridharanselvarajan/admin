const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db/db");
const Company = require("./models/companySchema");
const JoinedCompany = require("./models/joincompanies"); // New schema for joined companies
const Worker= require("./models/workerSchema");
const JoinedWorker = require("./models/joinworker");
const crypto = require("crypto"); // Import crypto for password generation


const nodemailer = require("nodemailer");

const { createTransport }=require("nodemailer");




connectDB();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes


const sendMail = async (to, subject, text) => {
  try {
    const sender = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "sabarim6369@gmail.com", // Replace with your email
        pass: "gsdn ofbj bvqp bwxt", // Use App Password
      },
    });

    // Compose the email
    const composeMail = {
      from: "sabarim6369@gmail.com",
      to,
      subject,
      text,
    };

    // Send mail
    await sender.sendMail(composeMail);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

app.post("/api/sendEmail", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    if (!to || !subject || !text) {
      return res.status(400).send("Missing required fields: 'to', 'subject', or 'text'");
    }

    // Generate a random password
    const password = crypto.randomBytes(6).toString("hex");

    // Append the password to the email text
    const emailText = `${text}\n\nYour generated password: ${password}`;

    // Send the email
    await sendMail(to, subject, emailText);

    // Respond with the generated password (optional, for further use)
    res.status(200).json({ message: "Email sent successfully", password });
  } catch (error) {
    console.error("Error in /api/sendEmail route:", error);
    res.status(500).send("Error sending email");
  }
});

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
    const apiKey = "25a8b9c23d51eb9f458fd6bdaba633dc"; // Replace with your actual API key
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




app.get("/api/workers", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).send("Error fetching workers");
  }
});

// Add worker (POST request)
app.post("/api/workers", async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    await newWorker.save();
    res.status(201).send("Worker added");
  } catch (err) {
    res.status(500).send("Error adding worker");
  }
});
// Delete worker (DELETE request)
app.delete("/api/workers/:phone", async (req, res) => {
  try {
    const { phone } = req.params; // Extract phone number from request parameters
    const deletedWorker = await Worker.findOneAndDelete({ phone }); // Delete worker by phone

    if (!deletedWorker) {
      return res.status(404).send("Worker not found");
    }

    res.status(200).send("Worker removed");
  } catch (err) {
    res.status(500).send("Error removing worker");
  }
});


// Update worker (PUT request)
app.put("/api/workers/:phone", async (req, res) => {
  try {
    const { phone } = req.params; // Extract phone number from request parameters
    const updatedWorker = await Worker.findOneAndUpdate({ phone }, req.body, { new: true });

    if (!updatedWorker) {
      return res.status(404).send("Worker not found");
    }

    res.status(200).send("Worker updated");
  } catch (err) {
    res.status(500).send("Error updating worker");
  }
});


// Assuming you have a similar structure as for joined companies

// Importing the JoinedWorker model

// Add worker to 'Joined Workers'
app.post("/api/joinWorkers", async (req, res) => {
  try {
    const newJoinedWorker = new JoinedWorker(req.body);
    await newJoinedWorker.save();
    res.status(201).json({ message: "Worker added to joined workers successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding worker to joined workers", details: error });
  }
});

// Get all joined workers
app.get("/api/joinWorkers", async (req, res) => {
  try {
    const joinedWorkers = await JoinedWorker.find();
    res.json(joinedWorkers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching joined workers data", details: error });
  }
});


// Delete a joined worker based on phone number
app.delete("/api/joinWorkers/:phone", async (req, res) => {
  try {
    const { phone } = req.params; // Extract the phone number from the request parameters

    const deletedJoinedWorker = await JoinedWorker.findOneAndDelete({ phone }); // Find and delete worker by phone number

    if (!deletedJoinedWorker) {
      return res.status(404).json({ error: "Joined worker not found" });
    }

    res.status(200).json({ message: "Joined worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting joined worker", details: error });
  }
});

// Update joined worker information based on phone
app.put("/api/joinWorkers/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const updatedJoinedWorker = await JoinedWorker.findOneAndUpdate(
      { phone }, // Find worker by phone
      req.body,  // Updated data
      { new: true } // Return the updated worker
    );

    if (!updatedJoinedWorker) {
      return res.status(404).json({ error: "Joined worker not found with the given phone number" });
    }

    res.status(200).json({
      message: "Joined worker information updated successfully",
      worker: updatedJoinedWorker
    });
  } catch (error) {
    console.error("Error updating joined worker:", error);
    res.status(500).json({ error: "Error updating joined worker", details: error });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
