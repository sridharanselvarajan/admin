import React, { useState } from "react";
import "../../src/style/companystatus.css";

const companyData = [
  {
    workerName: "Rajat Jaiswal",
    aadharNumber: "123456789012",
    address: "Coimbatore, Tamil Nadu",
    phone: "8960106544",
    secondPhone: "9597458562",
    email: "jaissrajat123@gmail.com",
    date: "2025-02-01",
  },
  {
    workerName: "Amit Verma",
    aadharNumber: "987654321098",
    address: "Bangalore, Karnataka",
    phone: "9876543210",
    secondPhone: "8123456789",
    email: "amitverma@techsolutions.com",
    date: "2025-02-02",
  },
];

const CompanyStatus = () => {
  const [addCompanies, setAddCompanies] = useState(companyData);
  const [joinCompanies, setJoinCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [filterText, setFilterText] = useState("");
  const [isAddCompanies, setIsAddCompanies] = useState(true); // New state to switch views

  // Move a company from "Add Companies" to "Join Companies"
  const handleAddToJoin = (company) => {
    setJoinCompanies([...joinCompanies, company]);
    setAddCompanies(addCompanies.filter((c) => c.workerName !== company.workerName));
  };

  // Remove company from either "Add Companies" or "Join Companies"
  const handleRemoveCompany = (workerName) => {
    if (!isAddCompanies) {
      setJoinCompanies(joinCompanies.filter((entry) => entry.workerName !== workerName));
    } else {
      setAddCompanies(addCompanies.filter((entry) => entry.workerName !== workerName));
    }
  };

  // Start editing a company
  const handleEditCompany = (company) => {
    setEditingCompany(company.workerName);
    setUpdatedDetails(company);
  };

  // Handle input change
  const handleChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  // Save updated company details
  const handleSaveUpdate = () => {
    setJoinCompanies(
      joinCompanies.map((company) =>
        company.workerName === editingCompany ? updatedDetails : company
      )
    );
    setEditingCompany(null);
  };

  // Filter companies based on user input
  const filteredCompanies = (isAddCompanies ? addCompanies : joinCompanies).filter((company) =>
    Object.values(company)
      .map(val => val && val.toString())  // Ensures all values are strings (including dates)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2 className="table-title">{isAddCompanies ? "Worker" : "Join Workers"}</h2>

      {/* Filter Input and Buttons Row */}
      <div className="filter-container">
        <label className="filterheader">Filter:</label>
        <input
          type="text"
          className="filterstatus"
          placeholder="Search by All"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        
        {/* Button to Switch Views */}
        <div className="filter-buttons">
          <button
            className="btn-filter"
            onClick={() => setIsAddCompanies(!isAddCompanies)} // Switch views on button click
          >
            {isAddCompanies ? "Go to Join Worker" : "Go to Add Worker"}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="scrap-table">
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Aadhar Number</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Second Phone</th>
              <th>Email</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                {editingCompany === entry.workerName ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="workerName"
                        value={updatedDetails.workerName}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={updatedDetails.aadharNumber}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={updatedDetails.address}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phone"
                        value={updatedDetails.phone}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="secondPhone"
                        value={updatedDetails.secondPhone}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={updatedDetails.email}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={updatedDetails.date}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveUpdate} className="btn-update">
                        Save
                      </button>
                      <button onClick={() => setEditingCompany(null)} className="btn-delete">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{entry.workerName}</td>
                    <td>{entry.aadharNumber}</td>
                    <td>{entry.address}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.secondPhone}</td>
                    <td>{entry.email}</td>
                    <td>{entry.date}</td>
                    <td>
                      {isAddCompanies ? (
                        <>
                          <button onClick={() => handleAddToJoin(entry)} className="btn-update">
                            Add
                          </button>
                          <button onClick={() => handleRemoveCompany(entry.workerName)} className="btn-delete">
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditCompany(entry)} className="btn-update">
                            Update
                          </button>
                          <button onClick={() => handleRemoveCompany(entry.workerName)} className="btn-delete">
                            Remove
                          </button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyStatus;
