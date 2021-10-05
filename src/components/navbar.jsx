import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
class NavBar extends Component {
  state = {};
  render() {
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand-sm navbar-warning bg-warning">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-dark" to="/">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              {user ? (
                ""
              ) : (
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/login">
                    Login
                  </Link>
                </li>
              )}
              {user && user.role === "manager" && (
                <React.Fragment>
                  <li className="nav-item dropdown">
                    <React.Fragment>
                      <a
                        className="nav-link dropdown-toggle text-dark"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Customers
                      </a>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to={`/addCustomer`}>
                          Add Customer
                        </Link>
                        <Link
                          className="dropdown-item"
                          to={`/allCustomers?page=1`}
                        >
                          View All Customers
                        </Link>
                      </div>
                    </React.Fragment>
                  </li>
                  <li className="nav-item dropdown">
                    <React.Fragment>
                      <a
                        className="nav-link dropdown-toggle text-dark"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Transactions
                      </a>
                      <div className="dropdown-menu">
                        <Link
                          className="dropdown-item"
                          to={`/allCheque?page=1`}
                        >
                          Cheques
                        </Link>
                        <Link className="dropdown-item" to={`/allNet?page=1`}>
                          Net Banking
                        </Link>
                      </div>
                    </React.Fragment>
                  </li>
                </React.Fragment>
              )}
              {user && user.role === "customer" && (
                <React.Fragment>
                  <li className="nav-item dropdown">
                    <React.Fragment>
                      <a
                        className="nav-link dropdown-toggle text-dark"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        View
                      </a>
                      <div className="dropdown-menu">
                        <Link
                          className="dropdown-item"
                          to={`/viewCheque?page=1`}
                        >
                          Cheque
                        </Link>
                        <Link className="dropdown-item" to={`/viewNet?page=1`}>
                          Net Banking
                        </Link>
                      </div>
                    </React.Fragment>
                  </li>
                  <li className="nav-item dropdown">
                    <React.Fragment>
                      <a
                        className="nav-link dropdown-toggle text-dark"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Details
                      </a>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to={`/customerDetails`}>
                          Customer
                        </Link>
                        <Link className="dropdown-item" to={`/nomineeDetails`}>
                          Nominee
                        </Link>
                      </div>
                    </React.Fragment>
                  </li>
                  <li className="nav-item dropdown">
                    <React.Fragment>
                      <a
                        className="nav-link dropdown-toggle text-dark"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Transaction
                      </a>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to={`/addPayee`}>
                          Add Payee
                        </Link>
                        <Link className="dropdown-item" to={`/cheque`}>
                          Cheque
                        </Link>
                        <Link className="dropdown-item" to={`/netBanking`}>
                          NetBanking
                        </Link>
                      </div>
                    </React.Fragment>
                  </li>
                </React.Fragment>
              )}
            </ul>
            {user ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link text-dark" href="#">
                    Welcome {user.name}
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
