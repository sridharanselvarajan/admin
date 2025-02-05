import React from "react";
import { Routes, Route } from "react-router-dom"; // Import necessary components for routing
import CombinedFormAndUsers from "./components/CombinedFormAndUsers"; // Import the new component
import Companystatus from "../src/components/company_status";
import CompanyAdmin from "../src/components/companyAdmin";
import WorkerAdmin from "../src/components/workerAdmin";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<CombinedFormAndUsers />} />
        <Route path="/companystatus" element={<Companystatus />} />
        <Route path="/add" element={<CompanyAdmin joinPage={false} />} />
        <Route path="/join" element={<CompanyAdmin joinPage={true} />} />
        <Route path="/addworker" element={<WorkerAdmin joinPage={false} />} />
        <Route path="/joinworker" element={<WorkerAdmin joinPage={true} />} />
      </Routes>
    </div>
  );
}

export default App;
