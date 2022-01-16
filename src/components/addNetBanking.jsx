import React, { Component } from "react";
import http from "../services/httpService";
class AddNetBanking extends Component {
  state = {
    netBank: {
      username: this.props.user,
      payeeName: "",
      amount: "",
      comment: "",
    },
    errors: {},
    payees: [],
    allPayees: [],
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.netBank[input.name] = input.value;
    if (input.name != "comment") {
      s1.errors[input.name] = "";
    }
    this.setState(s1);
  };

  validatePayeeName = (payeeName) => (!payeeName ? "Select Payee name" : "");
  validateAmount = (amount) => (!amount ? "Amount is Required" : "");

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    switch (input.name) {
      case "payeeName":
        s1.errors.payeeName = this.validatePayeeName(input.value);
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
    let user = this.props.user;
    let response = await http.get(`/getPayees/${user}`);
    let { data } = response;
    let payees = data.map((pay) => pay.payeeName);
    this.setState({ payees: payees, allPayees: data });
  }

  componentDidMount() {
    this.fetchData();
  }

  validateAll = () => {
    let errors = {};
    let { payeeName, amount } = this.state.netBank;
    errors.payeeName = this.validatePayeeName(payeeName);
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
    alert("details added successfully");
    window.location = "/customer";
  }

  addDetails = () => {
    let errors = this.validateAll();
    let { netBank, allPayees } = this.state;
    if (this.isValid(errors)) {
      let payeeBank =
        allPayees.length > 0 &&
        allPayees.find((pay) => pay.payeeName === netBank.payeeName).bankName;
      let item = { ...netBank, bankName: payeeBank };
      this.postData("/postNet", item);
    } else {
      this.setState({ errors: errors });
    }
  };

  render() {
    let { netBank, errors, payees } = this.state;
    let { payeeName, comment, amount } = netBank;
    return (
      <div className="container mt-4">
        <h4>Net Banking Details</h4>
        {this.makeDropdown(
          payees,
          payeeName,
          "payeeName",
          "Payee Name",
          "Select Payee",
          errors.payeeName
        )}
        {this.makeTextField(
          "amount",
          amount,
          "Amount",
          "Enter Amount",
          errors.amount
        )}
        {this.makeTextField(
          "comment",
          comment,
          "Comment",
          "Enter Comment",
          errors.comment
        )}
        <button
          className="btn btn-primary mt-2"
          onClick={() => this.addDetails()}
          style={{ paddingTop: "1px", paddingBottom: "1px" }}
        >
          Add Transaction
        </button>
      </div>
    );
  }

  makeTextField = (name, value, label, placeholder, error) => {
    let req = name !== "comment" ? <span className="text-danger">*</span> : "";
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

export default AddNetBanking;
