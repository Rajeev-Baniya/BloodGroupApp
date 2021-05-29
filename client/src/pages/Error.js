import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="text-center">
      <h3>Error: 404 (Page Not Found)</h3>
      <Link to="/">
        <button className="btn btn-primary">Home</button>{" "}
      </Link>
    </div>
  );
};

export default Error;
