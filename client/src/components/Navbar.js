import React from "react";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <Link to="/" className="navbar-brand">
        Blood Groups
      </Link>
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="nav-link">
              About us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default navbar;
