import React, { Component } from "react";
import http from "../services/httpService";
class NomineeDetails extends Component {
  state = {
    nominee: {
      name: this.props.user,
      gender: "",
      nomineeName: "",
      day: "",
      month: "",
      year: "",
      jointsignatory: false,
      relationship: "",
      submitDis: false,
    },
    errors: {},
  };

  handleChange = (e) => {
    let { currentTarget: input } = e;
    let s1 = { ...this.state };
    input.name === "jointsignatory"
      ? (s1.nominee.jointsignatory = input.checked)
      : (s1.nominee[input.name] = input.value);
    this.setState(s1);
  };

  validateYear = (year) => (!year ? "Year is Required" : "");
  validateMonth = (month) => (!month ? "Month is Required" : "");
  validateDay = (day) => (!day ? "Day is Required" : "");
  validateNomineeName = (nomineeName) =>
    !nomineeName ? "Name is Required" : "";
  validateRelationship = (relationship) =>
    !relationship ? "Relationship is Required" : "";
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
      case "relationship":
        s1.errors.relationship = this.validateRelationship(input.value);
        break;
      case "nomineeName":
        s1.errors.nomineeName = this.validateNomineeName(input.value);
        break;
      case "gender":
        s1.errors.gender = this.validateGender(input.value);
        break;

      default:
        break;
    }
    this.setState(s1);
  };

  async fetchData() {
    let user = this.props.user;
    let response = await http.get(`/getNominee/${user}`);
    let {
      gender = "",
      relationship = "",
      jointsignatory = "",
      name = "",
      dob = "",
      nomineeName = "",
    } = response.data;
    let dobArr = dob.split("-");
    let day = dobArr[0];
    let month = dobArr[1];
    let year = dobArr[2];
    let s1 = { ...this.state };
    if (gender && relationship && jointsignatory && nomineeName && dob)
      s1.submitDis = true;
    s1.nominee.gender = gender;
    s1.nominee.relationship = relationship;
    s1.nominee.nomineeName = nomineeName;
    s1.nominee.day = day;
    s1.nominee.month = month;
    s1.nominee.year = year;
    s1.nominee.jointsignatory = jointsignatory;

    this.setState(s1);
  }

  componentDidMount() {
    this.fetchData();
  }

  validateAll = () => {
    let errors = {};
    let { gender, nomineeName, relationship, day, month, year } =
      this.state.nominee;
    errors.gender = this.validateGender(gender);
    errors.nomineeName = this.validateNomineeName(nomineeName);
    errors.relationship = this.validateRelationship(relationship);
    errors.day = this.validateDay(day);
    errors.month = this.validateMonth(month);
    errors.year = this.validateYear(year);
    return errors;
  };

  isValid = (errors) => {
    let keys = Object.keys(errors); //keys in an array
    let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0);
    return count === 0;
  };

  async postData(url, obj) {
    await http.post(url, obj);
    alert(
      `${this.props.user} your Nominee :: ${this.state.nominee.nomineeName}`
    );
    window.location = "/customer";
  }

  addDetails = () => {
    let errors = this.validateAll();
    let {
      day,
      month,
      year,
      gender,
      nomineeName,
      name,
      relationship,
      jointsignatory,
    } = this.state.nominee;
    let dob = day + "-" + month + "-" + year;
    let item = {
      name: name,
      nomineeName: nomineeName,
      dob: dob,
      gender: gender,
      relationship: relationship,
      jointSignatory: jointsignatory,
    };
    if (this.isValid(errors)) {
      this.postData("/nomineeDetails", item);
    } else {
      let s1 = { ...this.state };
      s1.errors = errors;
      this.setState(s1);
      console.log("Enter into error submit");
    }
  };

  render() {
    let { nominee, errors, submitDis } = this.state;
    let {
      gender,
      nomineeName,
      relationship,
      day,
      month,
      year,
      jointsignatory,
    } = nominee;
    let years = [];
    for (let i = 1980; i <= 2021; i++) {
      years.push(i);
    }
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let days = [];
    if (year && month === "Feb") {
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
      month === "Jan" ||
      month === "Mar" ||
      month === "May" ||
      month === "Jul" ||
      month === "Aug" ||
      month === "Oct" ||
      month === "Dec"
    ) {
      for (let i = 1; i <= 31; i++) {
        days.push(i);
      }
    } else if (
      month === "Apr" ||
      month === "Jun" ||
      month === "Sep" ||
      month === "Nov"
    ) {
      for (let i = 1; i <= 30; i++) {
        days.push(i);
      }
    }

    return (
      <div className="container mt-4">
        <h4>Nominee Details</h4>
        {this.makeTextField(
          "nomineeName",
          nomineeName,
          "Name",
          "",
          errors.nomineeName
        )}
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
              onBlur={this.handleValidate}
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
              onBlur={this.handleValidate}
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
        <hr />
        {this.makeTextField(
          "relationship",
          relationship,
          "Relationship",
          "",
          errors.relationship
        )}
        <div className="form-group">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="jointsignatory"
              value={jointsignatory}
              checked={jointsignatory}
              onChange={this.handleChange}
            />
            <label class="form-check-label">Joint Signatory</label>
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
    let req =
      name === "nomineeName" || name === "relationship" ? (
        <span className="text-danger">*</span>
      ) : (
        ""
      );
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

export default NomineeDetails;
