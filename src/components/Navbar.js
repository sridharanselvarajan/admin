import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../src/style/header.css";

function Header() {
  const location = useLocation();

  return (
    <div className="headerbar">
      <header>
        <img src="" alt="logo" />
        <nav>
          <ul>
            <li>
              <Link to="/why-us">Why us?</Link>
            </li>
            <li>
              <Link to="/scrap-rates">Scrap Rates</Link>
            </li>
            <li>
              <Link to="/get-hired">Get Hired</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
