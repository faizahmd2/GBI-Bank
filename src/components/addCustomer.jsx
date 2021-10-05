import React, { Component } from "react";
import http from "../services/httpService";
class AddCustomer extends Component {
  state = { customer: { name: "", password: "", rePassword: "" }, errors: {} };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    if (s1.errors.rePassword) s1.errors.rePassword = "";
    if (s1.errors.name) s1.errors.name = "";
    s1.customer[input.name] = input.value;
    this.setState(s1);
  };

  async postData(url, obj) {
    await http.post(url, obj);
    alert("Customer added successfully")
    this.props.history.push("/admin");
  }

  handleKeyPress = (e) => {
    let { target: input } = e;
    let s1 = { ...this.state };
    if (input.name === "password")
      input.value.length < 7 && input.value.length > 0
        ? (s1.errors.password =
            "Password can not be blank. Minimum length should be 7 characters")
        : (s1.errors.password = "");
    this.setState(s1);
  };

  createCustomer = () => {
    let s1 = { ...this.state };
    let { name, password, rePassword } = s1.customer;
    if (!name) s1.errors.name = "Enter name";
    else if (password.length < 7)
      s1.errors.password =
        "Password can not be blank. Minimum length should be 7 characters";
    else if (password !== rePassword)
      s1.errors.rePassword = "Password did not matched";
    else {
      this.postData("/register", s1.customer);
      alert("Customer added successfully");
    }
    this.setState(s1);
  };

  render() {
    let { customer, errors } = this.state;
    let { name, password, rePassword } = customer;
    return (
      <div className="container mt-4">
        <h4>New Customer</h4>
        {this.makeTextField(
          "text",
          "name",
          name,
          "Name",
          "Enter customer name",
          errors.name
        )}
        {this.makeTextField(
          "password",
          "password",
          password,
          "Password",
          "",
          errors.password
        )}
        {this.makeTextField(
          "password",
          "rePassword",
          rePassword,
          "Confirm Password",
          "",
          errors.rePassword
        )}
        <button
          className="btn btn-primary mt-2"
          onClick={() => this.createCustomer()}
        >
          Create
        </button>
      </div>
    );
  }

  makeTextField = (type, name, value, label, placeholder, error) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        onBlur={this.handleValidate}
        onKeyUp={this.handleKeyPress}
      />
      <small className="text-danger mb-2">{error}</small>
    </div>
  );
}

export default AddCustomer;
