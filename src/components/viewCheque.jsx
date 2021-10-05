import React, { Component } from "react";
import http from "../services/httpService";
import queryString from "query-string";
class ViewCheque extends Component {
  state = {};

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let searchStr = this.makeSearchString(queryParams);
    let user = this.props.user;
    let response = await http.get(`/getChequeByName/${user + searchStr}`);
    let { data } = response;
    this.setState({
      allCheques: data.items,
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
    this.callURL("/viewCheque", queryParams);
  };

  render() {
    let {
      allCheques = [],
      page = 1,
      totalItems = null,
      totalNum = null,
    } = this.state;
    let start1 = totalNum > 0 ? 5 * (page - 1) + 1 : totalNum;
    let end1 = totalNum > 5 ? start1 + totalItems - 1 : totalNum;
    return (
      <div className="container mt-4">
        <h4>All Cheque details</h4>
        {allCheques.length !== 0 ? (
          <React.Fragment>
            {" "}
            <h6>
              {start1} - {end1} of {totalNum}
            </h6>
            <hr />
            <div className="row fw-bold">
              <div className="col-5">Cheque number</div>
              <div className="col-3">Bank name</div>
              <div className="col-2">Branch</div>
              <div className="col-2">Amount</div>
            </div>
            <hr />
            {allCheques.map((cust) => {
              let {
                chequeNumber = "",
                bankName = "",
                branch = "",
                amount = "",
              } = cust;
              return (
                <React.Fragment>
                  <div className="row">
                    <div className="col-5">{chequeNumber}</div>
                    <div className="col-3">{bankName}</div>
                    <div className="col-2">{branch}</div>
                    <div className="col-2">{amount}</div>
                  </div>
                  <hr />
                </React.Fragment>
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
          </React.Fragment>
        ) : (
          <h4 className="text-danger">No Transactions to show</h4>
        )}
      </div>
    );
  }
}

export default ViewCheque;
