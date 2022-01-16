import React, { Component } from "react";
import http from "../services/httpService";
import queryString from "query-string";
import CustomerDetailModel from "./Model/customerDetailModel";
import Tooltip from "@material-ui/core/Tooltip";
class ViewAllCustomers extends Component {
  state = {
    modal: { modalIsOpen: false, username: "", detail: {} },
  };

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let searchStr = this.makeSearchString(queryParams);
    let response = await http.get(`/getCustomers${searchStr}`);
    let { data } = response;
    this.setState({
      customers: data.items,
      page: data.page,
      totalItems: data.totalItems,
      totalNum: data.totalNum,
    });
  }

  callURL = (url, options) => {
    let searchStr = this.makeSearchString(options);
    this.props.history.push({ pathname: url, search: searchStr });
  };

  makeSearchString = (options) => {
    let { page = 1 } = options;
    let searchStr = "";
    searchStr = this.addToQueryString(searchStr, "page", page);
    return searchStr ? "?" + searchStr : searchStr;
  };

  addToQueryString = (str, paramName, paramValue) =>
    paramValue
      ? str
        ? `${str}&${paramName}=${paramValue}`
        : `${paramName}=${paramValue}`
      : str;

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) this.fetchData();
  }

  handlePage = (num) => {
    let queryParams = queryString.parse(this.props.location.search);
    let { page } = queryParams;
    let newPage = +page + num;
    queryParams.page = newPage;
    this.setState({ page: newPage });
    this.callURL("/allCustomers", queryParams);
  };

  handleModal = (username) => {
    console.log("Inside handleModal", username);
    let s1 = { ...this.state };
    s1.modal.modalIsOpen = true;
    s1.modal.username = username;
    let obj = this.state.customers.find((val) => val.username == username);
    s1.modal.detail = obj;
    this.setState(s1);
  };

  handleModalClose = () => {
    let s1 = { ...this.state };
    s1.modal.modalIsOpen = false;
    s1.modal.username = "";
    s1.modal.detail = {};
    this.setState(s1);
  };

  render() {
    let {
      customers = [],
      page = 1,
      totalItems = null,
      totalNum = null,
      modal,
    } = this.state;
    let start1 = totalNum > 0 ? 5 * (page - 1) + 1 : totalNum;
    let end1 = totalNum > 5 ? start1 + totalItems - 1 : totalNum;
    return (
      <>
        <div className="container mt-4">
          <h4>All Customers</h4>
          <h6>
            {start1} - {end1} of {totalNum}
          </h6>
          <hr />
          <div className="row fw-bold">
            <div className="col-2">Name</div>
            <div className="col-3">State</div>
            <div className="col-2">City</div>
            <div className="col-2">PAN</div>
            <div className="col-3">DOB</div>
          </div>
          <hr />
          {customers.map((cust) => {
            let {
              username = "",
              name = "",
              state = "",
              city = "",
              PAN = "",
              dob = "",
            } = cust;
            return (
              <>
                <div className="row" key={username}>
                  <Tooltip title="See User Details">
                    <div
                      className="col-2"
                      onClick={() => this.handleModal(username)}
                    >
                      <a href="#">{name}</a>
                    </div>
                  </Tooltip>
                  <div className="col-3">{state}</div>
                  <div className="col-2">{city}</div>
                  <div className="col-2">{PAN}</div>
                  <div className="col-3">{dob}</div>
                </div>
                <hr />
              </>
            );
          })}
          <div className="row">
            <div className="col-1">
              {page > 1 ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.handlePage(-1)}
                >
                  Prev
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="col-10"></div>
            <div className="col-1">
              {end1 === totalNum ? (
                ""
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => this.handlePage(1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
        {
          <CustomerDetailModel
            modal={modal}
            onModalClose={this.handleModalClose}
          />
        }
      </>
    );
  }
}

export default ViewAllCustomers;
