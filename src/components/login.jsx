import React, { Component } from "react";
import http from "../services/httpService";
import auth from "../services/authService";
class Login extends Component {
  state = {
    authData: { name: "", password: "" },
    passwordPress: "",
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.errors = {};
    s1.authData[input.name] = input.value;
    this.setState(s1);
  };

  handleKeyPress = (e) => {
    let { target: input } = e;
    let s1 = { ...this.state };
    input.value.length < 7 && input.value.length > 0
      ? (s1.passwordPress = "Password must be of 7 characters")
      : (s1.passwordPress = "");
    this.setState(s1);
  };

  async login(url, obj) {
    try {
      let response = await http.post(url, obj);
      let { data } = response;
      auth.login(data);
      if (data.role === "manager") window.location = "/admin";
      if (data.role === "customer") window.location = "/customer";
      this.setState({
        errors: {},
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 500) {
        let errors = {};
        errors.loginError = "Login Failed. Check the username or password";
        this.setState({ errors: errors });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { password, name } = this.state.authData;
    if ((!name && !password) || (!name && password) || (name && !password))
      this.setState({
        errors: { loginError: "Login Failed. Check the username or password" },
      });
    if (password.length > 6) this.login("/login", this.state.authData);
  };

  render() {
    let { authData, passwordPress, errors } = this.state;
    let { name, password } = authData;
    return (
      <div className="container text-center mt-5">
        <h2>Welcome to GBI Bank</h2>
        <div>User Name</div>
        <input
          className="form-control my-1"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
          style={{ width: "500px", margin: "0 auto" }}
          placeholder="Enter user name"
        />
        <div className="text-muted mb-2">
          We'll never share your user name with anyone else.
        </div>
        <div>Password</div>
        <input
          className="form-control mt-1 mb-1"
          type="password"
          name="password"
          value={password}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyPress}
          style={{ width: "500px", margin: "0 auto" }}
          placeholder="Password"
        />
        <div className="text-danger mb-3">{passwordPress}</div>
        <div className="text-danger mb-3">
          {errors.loginError ? errors.loginError : ""}
        </div>
        <div className="">
          <button className="btn btn-primary" onClick={this.handleSubmit}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
