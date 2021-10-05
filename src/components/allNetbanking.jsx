import React, { Component } from "react";
import http from "../services/httpService";
import queryString from "query-string";
import LeftPanelOptions from "./leftPanelOptions";
class AllNetBanking extends Component {
  state = {};

  async fetchData() {
    let queryParams = queryString.parse(this.props.location.search);
    let searchStr = this.makeSearchString(queryParams);
    let response1 = await http.get(`/getAllNetBankings${searchStr}`);
    let response2 = await http.get("/getBanks");
    let response3 = await http.get("/getAmount");
    let { data } = response1;
    this.setState({
      netBankings: data.items,
      page: data.page,
      totalItems: data.totalItems,
      totalNum: data.totalNum,
      banks: response2.data,
      amounts: response3.data,
    });
  }

  handleOptionChange = (options) => {
    this.callURL("/allNet", options);
  };

  callURL = (url, options) => {
    let searchStr = this.makeSearchString(options);
    this.props.history.push({ pathname: url, search: searchStr });
  };

  makeSearchString = (options) => {
    let { page = 1, bank, amount } = options;
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
    this.callURL("/allNet", queryParams);
  };

  render() {
    let {
      netBankings = [],
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
        <h4>All Net Banking Transactions</h4>
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
              <div className="col-3">Payee Name</div>
              <div className="col-2">Amount</div>
              <div className="col-2">Bank Name</div>
              <div className="col-3">Comment</div>
            </div>
            <hr />
            {netBankings.map((cheq) => {
              let {
                name = "",
                payeeName = "",
                bankName = "",
                comment = "",
                amount = "",
              } = cheq;
              return (
                <React.Fragment>
                  <div className="row ms-2">
                    <div className="col-2">{name}</div>
                    <div className="col-3">{payeeName}</div>
                    <div className="col-2">{amount}</div>
                    <div className="col-2">{bankName}</div>
                    <div className="col-3">{comment}</div>
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

export default AllNetBanking;
