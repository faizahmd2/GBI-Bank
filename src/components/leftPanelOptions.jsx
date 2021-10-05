import React, { Component } from "react";
class LeftPanelOptions extends Component {
  handleChange = (e) => {
    let { currentTarget: input } = e;
    let options = { ...this.props.options };
    options[input.name] = input.value;
    this.props.onOptionChange(options);
  };

  render() {
    let { banks, amounts, options } = this.props;
    let { bank = "", amount = "" } = options;
    return (
      <div>
        {this.makeRadio(banks, "bank", bank, "Bank")}
        <hr />
        {this.makeRadio(amounts, "amount", amount, "Amount")}
      </div>
    );
  }

  makeRadio = (arr, name, value, label) => (
    <div className="form-group me-2">
      <label className="form-check-label fw-bold form-control" style={{borderRadius:"0"}}>{label}</label>
      {arr.map((opt) => (
        <div className=" form-control" style={{borderRadius:"0"}}>
          <input
            type="radio"
            className="form-check-input"
            name={name}
            value={opt}
            checked={opt === value}
            onChange={this.handleChange}
          />
          <label className="form-check-label ms-1">{opt}</label>
        </div>
      ))}
    </div>
  );
}

export default LeftPanelOptions;
