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

const WorkerAdmin = () => {
  const [workers, setWorkers] = useState([]); // Stores the "Add Workers"
  const [joinWorkers, setJoinWorkers] = useState([]); // Stores the "Join Workers"
  const [editingWorker, setEditingWorker] = useState(null); // Tracks which worker is being edited
  const [updatedDetails, setUpdatedDetails] = useState({}); // Stores updated worker details
  const [filterText, setFilterText] = useState(""); // Stores the filter text for searching
  const [isAddWorkers, setIsAddWorkers] = useState(true); // Flag to switch between "Add Workers" and "Join Workers"

  // Fetch all workers from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const addWorkersResponse = await axios.get("http://localhost:3001/api/workers");
        const joinWorkersResponse = await axios.get("http://localhost:3001/api/joinWorkers");
        setWorkers(addWorkersResponse.data);
        setJoinWorkers(joinWorkersResponse.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddToJoin = async (worker) => {
    try {
      // Add the worker to the backend
      await axios.post("http://localhost:3001/api/joinWorkers", worker);
      setJoinWorkers((prevJoinWorkers) => [...prevJoinWorkers, worker]);
      setWorkers((prevWorkers) => prevWorkers.filter((w) => w.phone !== worker.phone));
  
      // Sending email notification
      const response = await axios.post("http://localhost:3001/api/sendEmail", {
        to: worker.email, // Email of the worker
        subject: "Worker Added Successfully",
        text: `Dear ${worker.workerName},\n\nYou have been successfully added to our system. Welcome aboard!\n\nBest regards,\nYour Team Name`,
      });
  
      const { password } = response.data; // Extract the password from the backend response
  
      alert(
        `${worker.workerName} has been successfully added to Join Workers and notified by email.\n\nGenerated password: ${password}`
      );
    } catch (error) {
      console.error("Error adding worker to join:", error);
      alert("Worker has already been added, please add a new worker.");
    }
  };
  

  const handleRemoveWorker = async (workerPhone, isAddWorkers) => {
    try {
      if (isAddWorkers) {
        // If it's for the "add workers" section, delete from workers API
        await axios.delete(`http://localhost:3001/api/workers/${workerPhone}`);
        // Re-fetch workers to sync state with the backend
        const response = await axios.get("http://localhost:3001/api/workers");
        setWorkers(response.data); // Update the state with fresh data from the backend
      } else {
        // If it's for the "join workers" section, delete from the "join workers" API
        await axios.delete(`http://localhost:3001/api/joinWorkers/${workerPhone}`);
        // Re-fetch join workers to sync state with the backend
        const response = await axios.get("http://localhost:3001/api/joinWorkers");
        setJoinWorkers(response.data); // Update the state with fresh data from the backend
      }
    } catch (error) {
      console.error("Error removing worker:", error);
    }
  };
  
  

  const handleEditWorker = (worker) => {
    setEditingWorker(worker.phone);
    setUpdatedDetails({
      ...worker,
      date: formatDate(worker.date),
    });
  };

  const handleChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  const handleSaveUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/joinWorkers/${updatedDetails.phone}`, updatedDetails);
      setJoinWorkers((prevJoinWorkers) =>
        prevJoinWorkers.map((worker) =>
          worker.phone === editingWorker ? updatedDetails : worker
        )
      );
      setEditingWorker(null);
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const filteredWorkers = (isAddWorkers ? workers : joinWorkers).filter((worker) =>
    Object.values(worker)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2 className="table-title">{isAddWorkers ? "Worker" : "Join Worker"}</h2>

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
            onClick={() => setIsAddWorkers(!isAddWorkers)}
          >
            {isAddWorkers ? "Go to Join Workers" : "Go to Add Workers"}
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
            {filteredWorkers.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                {editingWorker === entry.phone ? (
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
                      <button onClick={() => setEditingWorker(null)} className="btn-delete">
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
                      {isAddWorkers ? (
                        <>
                          <button onClick={() => handleAddToJoin(entry)} className="btn-update">
                            Add
                          </button>
                          <button onClick={() => handleRemoveWorker(entry.phone, isAddWorkers)} className="btn-delete">
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditWorker(entry)} className="btn-update">
                            Update
                          </button>
                          <button onClick={() => handleRemoveWorker(entry.phone, isAddWorkers)} className="btn-delete">
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

export default WorkerAdmin;
