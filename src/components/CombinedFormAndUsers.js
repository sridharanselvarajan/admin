import React, { useState } from "react";
import axios from "axios";
import "../style/combined.css";
import placeholderImage from '../image/image.jpg';

// Notification component
function Notification({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        animation: "fadeInOut 4s ease",
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: "10px",
          backgroundColor: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}

const SellForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [gstValid, setGstValid] = useState(null);
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [secondPhone, setSecondPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [userType, setUserType] = useState("user");
  const [notificationMessage, setNotificationMessage] = useState(""); // Notification message state
  const [notificationType, setNotificationType] = useState(""); // Success or Error type

  const handleGstChange = async (e) => {
    const gst = e.target.value.trim();
    setGstNumber(gst);

    // Only make API call if the GST number is 15 characters long
    if (gst.length === 15) {
      try {
        // Wait for a small delay to avoid unnecessary API calls
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Make a POST request to verify GST number
        const response = await axios.post("http://localhost:3001/api/verify-gst", { gstin: gst });

        console.log("GST Verification Response:", response.data);

        // Check response validity (ensure correct field name)
        if (response.data.flag) {
          setGstValid(true);  // Set validity to true if GST is valid
        } else {
          setGstValid(false);  // Set validity to false if GST is invalid
        }

      } catch (error) {
        console.error("Error verifying GST:", error?.response?.data || error.message);
        setGstValid(false);  // If an error occurs, mark as invalid
      }
    } else {
      setGstValid(null);  // Reset validity if GST is not 15 characters long
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gstValid === false) {
      setNotificationMessage("Invalid GST Number. Please check and enter a valid one.");
      setNotificationType("error");
      return;
    }

    const newFormData = {
      companyName,
      gstNumber,
      address,
      country,
      state,
      city,
      pincode,
      phone,
      secondPhone,
      email,
      date,
      userType,
    };

    axios.post("http://localhost:3001/api/sell", newFormData)
      .then((result) => {
        console.log("Form submitted successfully:", result.data);
        setNotificationMessage("Form Submitted Successfully!"); // Show success message
        setNotificationType("success"); // Set notification type as success

        // Hide notification after 2 seconds
        setTimeout(() => {
          setNotificationMessage("");
          setNotificationType("");
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        setNotificationMessage("Error submitting the form. Please try again."); // Show error message
        setNotificationType("error"); // Set notification type as error

        // Hide notification after 2 seconds
        setTimeout(() => {
          setNotificationMessage("");
          setNotificationType("");
        }, 2000);
      });
  };

  return (
    <div className="form-container">
      {/* Notification at the top of the form */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationMessage("")}
      />

      <div className="left-section">
        <h2 className="form-title">Company Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Company Name *</label>
            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>GST Number *</label>
            <input type="text" placeholder="GST Number" value={gstNumber} onChange={handleGstChange} maxLength={15} required />
            {gstValid === true && <p className="gst-success">✅ GST Verified</p>}
            {gstValid === false && <p className="gst-error">❌ Invalid GST Number</p>}
          </div>

          <div className="input-group">
            <label>Address *</label>
            <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="row">
            <div className="input-group">
              <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <input type="text" placeholder="Zip Code" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Second Phone (Optional)</label>
            <input type="text" placeholder="Second Phone" value={secondPhone} onChange={(e) => setSecondPhone(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <button type="submit" className="btn-submit">Submit</button>
        </form>
      </div>

      <div className="right-section">
        <div className="image-placeholder" style={{ width: "60%", padding: "14% 10% 20% 10%" }}>
          <img src={placeholderImage} alt="Placeholder" className="placeholder-img" />
        </div>
      </div>
    </div>
  );
};

export default SellForm;
