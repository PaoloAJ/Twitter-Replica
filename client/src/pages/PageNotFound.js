import "./PageNotFound.css";
import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="pageNotFound">
      <h1>Page not Found!</h1>
      Try this instead: <Link to="/">Home Page</Link>
    </div>
  );
}

export default PageNotFound;
