import React from "react";
import { Link } from "react-router-dom";
import './dashboard.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">MAMS</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard/asset">Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard/purchases">Purchases</Link>
        </li>
        <li>
          <Link to="/dashboard/transfers">Transfers</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
