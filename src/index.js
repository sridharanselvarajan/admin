import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Import your main App component

// Create the root and render the app
const root = ReactDOM.createRoot(document.getElementById("root")); // Create root
root.render(
  <BrowserRouter> {/* Wrap your App component with BrowserRouter */}
    <App />
  </BrowserRouter>
);
