import React, { Component } from "react";
import http from "../services/httpService";
class AddCheque extends Component {
  state = {
    cheque: {
      name: this.props.user,
      chequeNumber: "",
      bankName: "",
      branch: "",
      amount: "",
    },
    errors: {},
    banks: [],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.cheque[input.name] = input.value;
    this.setState(s1);
  };

  validateCheckNumber = (chequeNumber) =>
    !chequeNumber
      ? "Check Number is Required"
      : chequeNumber.length < 11
      ? "Enter your 11 digit Cheque number"
      : "";
  validateBankName = (bankName) => (!bankName ? "Bank Name is Required" : "");
  validateBranch = (branch) =>
    !branch
      ? "Branch is Required"
      : branch.length < 4
      ? "Enter four digit code of branch"
      : "";
  validateAmount = (amount) => (!amount ? "Amount is Required" : "");

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    switch (input.name) {
      case "chequeNumber":
        s1.errors.chequeNumber = this.validateCheckNumber(input.value);
        break;
      case "bankName":
        s1.errors.bankName = this.validateBankName(input.value);
        break;
      case "branch":
        s1.errors.branch = this.validateBranch(input.value);
        break;
      case "amount":
        s1.errors.amount = this.validateAmount(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  async fetchData() {
    let response = await http.get(`/getBanks`);
    let { data } = response;
    this.setState({ banks: data });
  }

  componentDidMount() {
    this.fetchData();
  }

  validateAll = () => {
    let errors = {};
    let { chequeNumber, branch, bankName, amount } = this.state.cheque;
    errors.chequeNumber = this.validateCheckNumber(chequeNumber);
    errors.bankName = this.validateBankName(bankName);
    errors.branch = this.validateBranch(branch);
    errors.amount = this.validateAmount(amount);
    return errors;
  };

  isValid = (errors) => {
    let keys = Object.keys(errors); //keys in an array
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  async postData(url, obj) {
    await http.post(url, obj);
    alert("Details added successfully");
    window.location = "/customer";
  }

  addDetails = () => {
    let errors = this.validateAll();
    let { cheque } = this.state;
    if (this.isValid(errors)) {
      this.postData("/postCheque", cheque);
    } else {
      this.setState({ errors: errors });
    }
  };

  render() {
    let { cheque, errors, banks } = this.state;
    let { chequeNumber, bankName, branch, amount } = cheque;
    return (
      <div className="container mt-4">
        <h4>Deposit Cheque</h4>
        {this.makeTextField(
          "chequeNumber",
          chequeNumber,
          "Cheque Number",
          "Enter Cheque Number",
          errors.chequeNumber
        )}
        {this.makeDropdown(
          banks,
          bankName,
          "bankName",
          "Bank Name",
          "Select Bank",
          errors.bankName
        )}
        {this.makeTextField(
          "branch",
          branch,
          "Branch",
          "Enter Branch Code",
          errors.branch
        )}
        {this.makeTextField(
          "amount",
          amount,
          "Amount",
          "Enter Amount",
          errors.amount
        )}
        <button
          className="btn btn-primary mt-2"
          onClick={() => this.addDetails()}
          style={{ paddingTop: "1px", paddingBottom: "1px" }}
        >
          Add Cheque
        </button>
      </div>
    );
  }

  makeTextField = (name, value, label, placeholder, error) => {
    let req = <span className="text-danger">*</span>;
    return (
      <div className="form-group">
        <label className="h6">
          {label}
          {req}
        </label>
        <input
          type="text"
          className="form-control"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.handleValidate}
        />
        {error ? (
          <button
            className="btn form-control"
            style={{ background: "#f5c4b5" }}
          >
            {error}
          </button>
        ) : (
          ""
        )}
      </div>
    );
  };

  makeDropdown = (arr, value, name, label, topStr, error) => {
    let req = <span className="text-danger">*</span>;
    return (
      <div className="form-group">
        <label className="form-check-label h6">
          {label}
          {req}
        </label>
        <select
          className="form-control"
          value={value}
          name={name}
          onChange={this.handleChange}
          onBlur={this.handleValidate}
        >
          <option disabled value="">
            {topStr}
          </option>
          {arr.map((c1) => (
            <option>{c1}</option>
          ))}
        </select>
        {error ? (
          <button
            className="btn form-control"
            style={{ background: "#f5c4b5" }}
          >
            {error}
          </button>
        ) : (
          ""
        )}
      </div>
    );
  };
}

export default AddCheque;
