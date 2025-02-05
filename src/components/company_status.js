import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/style/companystatus.css";

const CompanyStatus = () => {
  const [companyNameFilter, setCompanyNameFilter] = useState("");
  const [gstNumberFilter, setGstNumberFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCompany, setEditingCompany] = useState(null); // Track company being edited
  const [updatedCompany, setUpdatedCompany] = useState({
    companyName: "",
    gstNumber: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/companies");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch company data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDeleteUser = async (phone) => {
    try {
      await axios.delete(`http://localhost:3001/api/companies/${phone}`);
      setUsers((prevUsers) => prevUsers.filter((entry) => entry.phone !== phone)); // Update the state immediately
    } catch (err) {
      setError("Failed to delete company. Please try again.");
    }
  };
  

  const handleEditClick = (company) => {
    setEditingCompany(company.phone); // Use phone for tracking edit mode
    setUpdatedCompany({
      companyName: company.companyName,
      gstNumber: company.gstNumber,
      address: company.address,
      phone: company.phone,
      email: company.email,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (phone) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/companies/${phone}`, updatedCompany);
      setUsers(users.map((entry) => (entry.phone === phone ? response.data.company : entry)));
      setEditingCompany(null); // Stop editing mode
    } catch (err) {
      setError("Failed to update company. Please try again.");
    }
  };

  const filteredData = users.filter((entry) => {
    return (
      (companyNameFilter === "" || entry.companyName.toLowerCase().includes(companyNameFilter.toLowerCase())) &&
      (gstNumberFilter === "" || entry.gstNumber.replace(/\s+/g, '').toLowerCase().includes(gstNumberFilter.replace(/\s+/g, '').toLowerCase())) &&
      (phoneFilter === "" || entry.phone.includes(phoneFilter)) &&
      (emailFilter === "" || entry.email.toLowerCase().includes(emailFilter.toLowerCase()))
    );
  });
  
  return (
    <div>
      <div className="table-container">
        <h2 className="table-title">Company Status</h2>

        {loading && <p>Loading company data...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="filter-container">
          <input 
            type="text" 
            placeholder="Company Name" 
            value={companyNameFilter} 
            onChange={(e) => setCompanyNameFilter(e.target.value)} 
            className="filterstatus" 
          />
          <input 
            type="text" 
            placeholder="GST Number" 
            value={gstNumberFilter} 
            onChange={(e) => setGstNumberFilter(e.target.value)} 
            className="filterstatus" 
          />
          <input 
            type="text" 
            placeholder="Phone" 
            value={phoneFilter} 
            onChange={(e) => setPhoneFilter(e.target.value)} 
            className="filterstatus" 
          />
          <input 
            type="text" 
            placeholder="Email" 
            value={emailFilter} 
            onChange={(e) => setEmailFilter(e.target.value)} 
            className="filterstatus" 
          />
        </div>

        <div className="table-wrapper">
          <table className="scrap-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>GST Number</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {editingCompany === entry.phone ? (
                        <input
                          type="text"
                          name="companyName"
                          value={updatedCompany.companyName}
                          onChange={handleUpdateChange}
                        />
                      ) : (
                        entry.companyName
                      )}
                    </td>
                    <td>
                      {editingCompany === entry.phone ? (
                        <input
                          type="text"
                          name="gstNumber"
                          value={updatedCompany.gstNumber}
                          onChange={handleUpdateChange}
                        />
                      ) : (
                        entry.gstNumber
                      )}
                    </td>
                    <td>
                      {editingCompany === entry.phone ? (
                        <input
                          type="text"
                          name="address"
                          value={updatedCompany.address}
                          onChange={handleUpdateChange}
                        />
                      ) : (
                        entry.address
                      )}
                    </td>
                    <td>
                      {editingCompany === entry.phone ? (
                        <input
                          type="text"
                          name="phone"
                          value={updatedCompany.phone}
                          onChange={handleUpdateChange}
                        />
                      ) : (
                        entry.phone
                      )}
                    </td>
                    <td>
                      {editingCompany === entry.phone ? (
                        <input
                          type="text"
                          name="email"
                          value={updatedCompany.email}
                          onChange={handleUpdateChange}
                        />
                      ) : (
                        entry.email
                      )}
                    </td>
                    <td>
                      {new Date(entry.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {editingCompany === entry.phone ? (
                        <button onClick={() => handleUpdateSubmit(entry.phone)} className="btn-update">
                          Update
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(entry)} className="btn-edit">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteUser(entry.phone)} className="btn-delete">
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No matching data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatus;
