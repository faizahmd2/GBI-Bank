import React, { Component } from "react";
import http from "../services/httpService";
class CustomerDetails extends Component {
  state = {
    customer: {
      name: this.props.user,
      gender: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      day: "",
      month: "",
      year: "",
      PAN: "",
    },
    submitDis: false,
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    s1.customer[input.name] = input.value;
    this.setState(s1);
  };

  validateYear = (year) => (!year ? "Year is Required" : "");
  validateMonth = (month) => (!month ? "Month is Required" : "");
  validateDay = (day) => (!day ? "Day is Required" : "");
  validatePAN = (PAN) => (!PAN ? "PAN number is Required" : "");
  validateState = (state) => (!state ? "State is Required" : "");
  validateCity = (city) => (!city ? "City is Required" : "");
  validateGender = (gender) => (!gender ? "Choose gender" : "");

  handleValidate = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    switch (input.name) {
      case "year":
        s1.errors.year = this.validateYear(input.value);
        break;
      case "month":
        s1.errors.month = this.validateMonth(input.value);
        break;
      case "day":
        s1.errors.day = this.validateDay(input.value);
        break;
      case "PAN":
        s1.errors.PAN = this.validatePAN(input.value);
        break;
      case "state":
        s1.errors.state = this.validateState(input.value);
        break;
      case "city":
        s1.errors.city = this.validateCity(input.value);
        break;
      default:
        break;
    }
    this.setState(s1);
  };

  async fetchData() {
    let user = this.props.user;
    let response = await http.get(`/getCustomer/${user}`);
    let {
      gender = "",
      addressLine1 = "",
      city = "",
      state = "",
      dob = "",
      PAN = "",
    } = response.data;
    let dobArr = dob.split("-");
    let day = dobArr[0];
    let month = dobArr[1];
    let year = dobArr[2];
    let s1 = { ...this.state };
    if (gender && city && state && PAN && dob) s1.submitDis = true;
    s1.customer.gender = gender;
    s1.customer.addressLine1 = addressLine1;
    s1.customer.city = city;
    s1.customer.state = state;
    s1.customer.PAN = PAN;
    s1.customer.day = day;
    s1.customer.month = month;
    s1.customer.year = year;
    if(!s1.submitDis) {
      let response1 = await http.get("/statecity");
      s1.statecity = response1.data;
      s1.states = s1.statecity.map((st) => st.stateName);
    }
    this.setState(s1);
  }

  componentDidMount() {
    this.fetchData();
  }

  validateAll = () => {
    let errors = {};
    let { gender, state, city, day, month, year, PAN } = this.state.customer;
    errors.gender = this.validateGender(gender);
    errors.state = this.validateState(state);
    errors.city = this.validateCity(city);
    errors.day = this.validateDay(day);
    errors.month = this.validateMonth(month);
    errors.year = this.validateYear(year);
    errors.PAN = this.validatePAN(PAN);
    return errors;
  };

  isValid = (errors) => {
    let keys = Object.keys(errors); //keys in an array
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  async postData(url, obj) {
    await http.post(url, obj);
    alert(`${this.props.user} details added Successfully`);
    window.location = "/customer";
  }

  addDetails = () => {
    let errors = this.validateAll();
    let {
      day,
      month,
      year,
      PAN,
      state,
      city,
      gender,
      addressLine1,
      addressLine2,
      name,
    } = this.state.customer;
    let dob = day + "-" + month + "-" + year;
    let item = {
      name: name,
      PAN: PAN,
      dob: dob,
      gender: gender,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      state: state,
      city: city,
    };
    if (this.isValid(errors)) this.postData("/customerDetails", item);
    else {
      let s1 = { ...this.state };
      s1.errors = errors;
      this.setState(s1);
    }
  };

  render() {
    let { customer, errors, states = [], statecity = [], submitDis } = this.state;
    let {
      gender,
      addressLine1,
      addressLine2,
      state,
      city,
      day,
      month,
      year,
      PAN,
    } = customer;
    let cities = [];
    if(submitDis){
      states.push(state);
      cities.push(city);
    }
    else{
      cities = state
      ? statecity.find((stt) => stt.stateName === state).cityArr
      : [];
    }
    let years = [];
    for (let i = 1960; i <= 2021; i++) {
      years.push(i);
    }
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [];
    if (year && month === "February") {
      if (year % 4 === 0) {
        for (let i = 1; i <= 29; i++) {
          days.push(i);
        }
      } else {
        for (let i = 1; i <= 28; i++) {
          days.push(i);
        }
      }
    } else if (
      month === "January" ||
      month === "March" ||
      month === "May" ||
      month === "July" ||
      month === "August" ||
      month === "October" ||
      month === "December"
    ) {
      for (let i = 1; i <= 31; i++) {
        days.push(i);
      }
    } else if (
      month === "April" ||
      month === "June" ||
      month === "September" ||
      month === "November"
    ) {
      for (let i = 1; i <= 30; i++) {
        days.push(i);
      }
    }

    return (
      <div className="container mt-4">
        <h4>Customer Details</h4>
        <div className="form-group mt-4 h6">
          <label className="form-check-inline">
            Gender<span className="text-danger">*</span>
          </label>
          <div
            className="form-check form-check-inline"
            style={{ marginLeft: "80px" }}
          >
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={this.handleChange}
            />
            <label className="form-check-label">Male</label>
          </div>
          <div
            className="form-check form-check-inline"
            style={{ marginLeft: "120px" }}
          >
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={this.handleChange}
            />
            <label className="form-check-label">Female</label>
          </div>
          {errors.gender ? (
            <button
              className="btn form-control"
              style={{ background: "#f5c4b5" }}
            >
              {errors.gender}
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="row">
          <div className="col-4" style={{ marginTop: "-5px" }}>
            {this.makeDropdown(
              years,
              year,
              "year",
              "Date of Birth",
              "Select Year",
              errors.year
            )}
          </div>
          <div className="col-4">
            {this.makeDropdown(
              months,
              month,
              "month",
              "",
              "Select Month",
              errors.month
            )}
          </div>
          <div className="col-4">
            {this.makeDropdown(days, day, "day", "", "Select Day", errors.day)}
          </div>
        </div>

        {this.makeTextField("PAN", PAN, "PAN", "", errors.PAN)}
        <div className="row">
          <div className="h6">Address</div>
          <div className="col-5" style={{ marginTop: "-25px" }}>
            {this.makeTextField(
              "addressLine1",
              addressLine1,
              "",
              "Line 1",
              errors.addressLine1
            )}
          </div>
          <div className="col-5" style={{ marginTop: "-25px" }}>
            {this.makeTextField(
              "addressLine2",
              addressLine2,
              "",
              "Line 2",
              errors.addressLine2
            )}
          </div>
        </div>
        <div className="row h6">
          <div className="col-6">
            State<span className="text-danger">*</span>
          </div>
          <div className="col-6">
            City<span className="text-danger">*</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6" style={{ marginTop: "-25px" }}>
            {this.makeDropdown(
              states,
              state,
              "state",
              "",
              "Select State",
              errors.state
            )}
          </div>
          <div className="col-6" style={{ marginTop: "-25px" }}>
            {this.makeDropdown(
              cities,
              city,
              "city",
              "",
              "Select City",
              errors.city
            )}
          </div>
        </div>
        {!submitDis ? (
          <button
            className="btn btn-primary mt-2"
            onClick={() => this.addDetails()}
            style={{ paddingTop: "1px", paddingBottom: "1px" }}
          >
            Add Details
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }

  makeTextField = (name, value, label, placeholder, error) => {
    let req = name === "PAN" ? <span className="text-danger">*</span> : "";
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
          onKeyUp={this.handleKeyPress}
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
    let req = name === "year" ? <span className="text-danger">*</span> : "";
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

export default CustomerDetails;
