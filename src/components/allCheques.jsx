import React, { Component } from "react";
import http from "../services/httpService";
import queryString from "query-string";
import LeftPanelOptions from "./leftPanelOptions";
class AllCheques extends Component {
  state = {};

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let searchStr = this.makeSearchString(queryParams);
    let response1 = await http.get(`/getAllCheques${searchStr}`);
    let response2 = await http.get("/getBanks");
    let response3 = await http.get("/getAmount");
    let { data } = response1;
    this.setState({
      cheques: data.items,
      page: data.page,
      totalItems: data.totalItems,
      totalNum: data.totalNum,
      banks: response2.data,
      amounts: response3.data,
    });
  }

  handleOptionChange = (options) => {
    this.callURL("/allCheque", options, "handleOptionChange");
  };

  callURL = (url, options, checkForOptionChange="") => {
    let searchStr = this.makeSearchString(options, checkForOptionChange);
    this.props.history.push({ pathname: url, search: searchStr });
  };

  makeSearchString = (options,checkForOptionChange) => {
    let { page = 1, bank, amount } = options;
    if (checkForOptionChange) page = 1;
    let searchStr = "";
    searchStr = this.addToQueryString(searchStr, "page", page);
    searchStr = this.addToQueryString(searchStr, "bank", bank);
    searchStr = this.addToQueryString(searchStr, "amount", amount);
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
    this.callURL("/allCheque", queryParams);
  };

  render() {
    let {
      cheques = [],
      page = 1,
      totalItems = null,
      totalNum = null,
      banks = [],
      amounts = [],
    } = this.state;
    let start1 = totalNum > 0 ? 5 * (page - 1) + 1 : totalNum;
    let end1 = totalNum > 5 ? start1 + totalItems - 1 : totalNum;
    let queryParams = queryString.parse(this.props.location.search);
    return (
      <div className="container mt-4">
        <h4>All Cheque Transactions</h4>
        <div className="row">
          <div className="col-2">
            {
              <LeftPanelOptions
                banks={banks}
                amounts={amounts}
                options={queryParams}
                onOptionChange={this.handleOptionChange}
              />
            }
          </div>
          <div className="col-10">
            <h6>
              {start1} - {end1} of {totalNum}
            </h6>
            <hr />
            <div className="row fw-bold ms-2">
              <div className="col-2">Name</div>
              <div className="col-3">Cheque Number</div>
              <div className="col-2">Bank Name</div>
              <div className="col-2">Branch</div>
              <div className="col-3">Amount</div>
            </div>
            <hr />
            {cheques.map((cheq) => {
              let {
                name = "",
                chequeNumber = "",
                bankName = "",
                branch = "",
                amount = "",
              } = cheq;
              return (
                <React.Fragment>
                  <div className="row ms-2">
                    <div className="col-2">{name}</div>
                    <div className="col-3">{chequeNumber}</div>
                    <div className="col-2">{bankName}</div>
                    <div className="col-2">{branch}</div>
                    <div className="col-3">{amount}</div>
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
          </div>
        </div>
      </div>
    );
  }
}

export default AllCheques;
