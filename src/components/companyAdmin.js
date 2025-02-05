import React, { useState, useEffect } from "react";
import "../../src/style/companystatus.css";
import axios from "axios";

// Date format helper function
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CompanyStatus = () => {
  const [companies, setCompanies] = useState([]); // Stores the "Add Companies"
  const [joinCompanies, setJoinCompanies] = useState([]); // Stores the "Join Companies"
  const [editingCompany, setEditingCompany] = useState(null); // Tracks which company is being edited
  const [updatedDetails, setUpdatedDetails] = useState({}); // Stores updated company details
  const [filterText, setFilterText] = useState(""); // Stores the filter text for searching
  const [isAddCompanies, setIsAddCompanies] = useState(true); // Flag to switch between "Add Companies" and "Join Companies"

  // Fetch all companies from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const addCompaniesResponse = await axios.get("http://localhost:3001/api/companies");
        const joinCompaniesResponse = await axios.get("http://localhost:3001/api/joinCompanies");
        setCompanies(addCompaniesResponse.data);
        setJoinCompanies(joinCompaniesResponse.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddToJoin = async (company) => {
    try {
      // Optional: Disable "Add" button here (add loading state if necessary)
      await axios.post("http://localhost:3001/api/joinCompanies", company);
      
      // Update "Join Companies" and "Add Companies" states
      setJoinCompanies((prevJoinCompanies) => [...prevJoinCompanies, company]);
      setCompanies((prevCompanies) => prevCompanies.filter((c) => c.phone !== company.phone));
      
      // Show success message
      alert(`${company.companyName} has been successfully added to Join Companies.`);
    } catch (error) {
      console.error("Error adding company to join:", error);
      alert("Failed to add the company to Join Companies. Please try again.");
    }
  };
  

  const handleRemoveCompany = async (companyPhone, isAddCompanies) => {
    try {
      if (isAddCompanies) {
        await axios.delete(`http://localhost:3001/api/companies/${companyPhone}`);
        setCompanies((prevCompanies) => prevCompanies.filter((entry) => entry.phone !== companyPhone));
      } else {
        await axios.delete(`http://localhost:3001/api/joinCompanies/${companyPhone}`);
        setJoinCompanies((prevJoinCompanies) => prevJoinCompanies.filter((entry) => entry.phone !== companyPhone));
      }
    } catch (error) {
      console.error("Error removing company:", error);
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company.phone);
    setUpdatedDetails({
      ...company,
      date: formatDate(company.date),
    });
  };

  const handleChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  const handleSaveUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/joinCompanies/${updatedDetails.phone}`, updatedDetails);
      setJoinCompanies((prevJoinCompanies) =>
        prevJoinCompanies.map((company) =>
          company.phone === editingCompany ? updatedDetails : company
        )
      );
      setEditingCompany(null);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const filteredCompanies = (isAddCompanies ? companies : joinCompanies).filter((company) =>
    Object.values(company)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2 className="table-title">{isAddCompanies ? "Company" : "Join Company"}</h2>

      <div className="filter-container">
        <label className="filterheader">Filter:</label>
        <input
          type="text"
          className="filterstatus"
          placeholder="Search by All"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className="btn-filter"
            onClick={() => setIsAddCompanies(!isAddCompanies)}
          >
            {isAddCompanies ? "Go to Join Companies" : "Go to Add Companies"}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="scrap-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>GST Number</th>
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
                {editingCompany === entry.phone ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="companyName"
                        value={updatedDetails.companyName}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="gstNumber"
                        value={updatedDetails.gstNumber}
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
                    <td>{entry.companyName}</td>
                    <td>{entry.gstNumber}</td>
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
                          <button onClick={() => handleRemoveCompany(entry.phone, isAddCompanies)} className="btn-delete">
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditCompany(entry)} className="btn-update">
                            Update
                          </button>
                          <button onClick={() => handleRemoveCompany(entry.phone, isAddCompanies)} className="btn-delete">
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


