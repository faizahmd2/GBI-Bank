import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AllCheques from "./allCheques";
import AllNetbanking from "./allNetbanking";
import Login from "./login";
import Logout from "./logout";
import NavBar from "./navbar";
import ViewAllCustomers from "./viewAllCustomers";
import auth from "../services/authService";
import AdminLogin from "./adminLogin";
import AddCustomer from "./addCustomer";
import CustomerLogin from "./customerLogin";
import ViewCheque from "./viewCheque";
import ViewNet from "./viewNet";
import CustomerDetails from "./customerDetails";
import NomineeDetails from "./nomineeDetails";
import AddPayee from "./addPayee";
import AddCheque from "./addCheque";
import AddNetBanking from "./addNetBanking";
import NotAllowed from "./notAllowed";
class MainComponent extends Component {
  render() {
    const user = auth.getUser();
    return (
      <div>
        <NavBar user={user} />
        <Switch>
          <Route
            path="/allCustomers"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <ViewAllCustomers {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addCustomer"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AddCustomer {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allCheque"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AllCheques {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/allNet"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AllNetbanking {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/viewCheque"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <ViewCheque {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/viewNet"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <ViewNet {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/customerDetails"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <CustomerDetails {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/nomineeDetails"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <NomineeDetails {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/cheque"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <AddCheque {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/netBanking"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <AddNetBanking {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/addPayee"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <AddPayee {...props} user={user.name} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/login"
            render={(props) =>
              !user ? (
                <Login {...props} />
              ) : user && user.role === "manager" ? (
                <Redirect to="/admin" />
              ) : user && user.role === "customer" ? (
                <Redirect to="/customer" />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/logout"
            render={(props) =>
              user ? <Logout {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/admin"
            render={(props) =>
              user ? (
                user.role === "manager" ? (
                  <AdminLogin {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/customer"
            render={(props) =>
              user ? (
                user.role === "customer" ? (
                  <CustomerLogin {...props} />
                ) : (
                  <Redirect to="/notAllowed" />
                )
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/notAllowed" component={NotAllowed} />
          {user ? (
            user.role === "manager" ? (
              <Redirect from="/" to="/admin" />
            ) : user.role === "customer" ? (
              <Redirect from="/" to="/customer" />
            ) : (
              <Redirect from="/" to="/login" />
            )
          ) : (
            <Redirect from="/" to="/login" />
          )}
        </Switch>
      </div>
    );
  }
}

export default MainComponent;
