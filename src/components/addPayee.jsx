import React, { Component } from "react";
import http from "../services/httpService";
class AddPayee extends Component {
  state = {
    payee: {
      name: this.props.user,
      payeeName: "",
      accNumber: "",
      IFSC: "",
      bankName: "",
      bankOpt: "",
    },
    errors: {},
    banks: [],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.payee[input.name] = input.value;
    this.setState(s1);
  };

  validatePayeeName = (payeeName) => (!payeeName ? "Enter Payee name" : "");
  validateIFSC = (IFSC) => (!IFSC ? "IFSC is Required" : "");
  validateAccNumber = (accNumber) =>
    !accNumber ? "Account Number is Required" : "";

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    switch (input.name) {
      case "payeeName":
        s1.errors.payeeName = this.validatePayeeName(input.value);
        break;
      case "IFSC":
        s1.errors.IFSC = this.validateIFSC(input.value);
        break;
      case "accNumber":
        s1.errors.accNumber = this.validateAccNumber(input.value);
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
    let { payeeName, IFSC, accNumber, bankOpt } = this.state.payee;
    errors.payeeName = this.validatePayeeName(payeeName);
    if (bankOpt === "otherBank") errors.IFSC = this.validateIFSC(IFSC);
    errors.accNumber = this.validateAccNumber(accNumber);
    return errors;
  };

  isValid = (errors) => {
    let keys = Object.keys(errors); //keys in an array
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  async postData(url, obj) {
    await http.post(url, obj);
    alert(`Payee added to your list :: ${this.state.payee.payeeName}`);
    window.location = "/customer";
  }

  addDetails = () => {
    let errors = this.validateAll();
    let { payee } = this.state;
    delete payee.bankOpt;
    if (this.isValid(errors)) {
      this.postData("/addPayee", payee);
    } else {
      this.setState({ errors: errors });
    }
  };

  render() {
    let { errors, payee, banks } = this.state;
    let { payeeName, accNumber, IFSC, bankName, bankOpt } = payee;
    return (
      <div className="container mt-4">
        <h4>Add Payee</h4>
        {this.makeTextField(
          "payeeName",
          payeeName,
          "Payee Name",
          "Enter Payee Name",
          errors.payeeName
        )}
        {this.makeTextField(
          "accNumber",
          accNumber,
          "Account Number",
          "Enter Account Number",
          errors.accNumber
        )}

        <div className="form-group">
          <input
            className="form-check-input"
            type="radio"
            name="bankOpt"
            value="sameBank"
            checked={bankOpt === "sameBank"}
            onChange={this.handleChange}
          />
          <label className="form-check-label ms-1">Same Bank</label>
          <br />
          <input
            className="form-check-input"
            type="radio"
            name="bankOpt"
            value="otherBank"
            checked={bankOpt === "otherBank"}
            onChange={this.handleChange}
          />
          <label className="form-check-label ms-1">Other Bank</label>
        </div>

        {bankOpt === "otherBank"
          ? this.makeDropdown(
              banks,
              bankName,
              "bankName",
              "Bank Name",
              "Select Bank",
              errors.bankName
            )
          : ""}
        {bankOpt === "otherBank"
          ? this.makeTextField(
              "IFSC",
              IFSC,
              "IFSC code",
              "Enter IFSC code",
              errors.IFSC
            )
          : ""}
        <button
          className="btn btn-primary mt-2"
          onClick={() => this.addDetails()}
          style={{ paddingTop: "1px", paddingBottom: "1px" }}
        >
          Add Payee
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

  makeDropdown = (arr, value, name, label, topStr) => {
    return (
      <div className="form-group">
        <label className="form-check-label h6">{label}</label>
        <select
          className="form-control"
          value={value}
          name={name}
          onChange={this.handleChange}
        >
          <option disabled value="">
            {topStr}
          </option>
          {arr.map((c1) => (
            <option>{c1}</option>
          ))}
        </select>
      </div>
    );
  };
}

export default AddPayee;
