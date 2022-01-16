import React, { Component } from "react";
import Modal from "react-modal";
import http from "../../services/httpService";
import { Tooltip } from "@material-ui/core";
class CustomerDetailModel extends Component {
  state = {
    modal: this.props.modal,
    nominee: "",
  };

  closeModal = () => {
    this.props.onModalClose();
    this.setState({ nominee: "" });
  };

  afterOpenModal = () => {
    this.fetchData(this.state.modal.username);
  };

  async fetchData(username) {
    let response = await http.get(`/getNominee/${username}`);
    if (response.data) {
      this.setState({ nominee: response.data });
    }
  }

  getNominee() {
    let det = this.state.nominee;
    return (
      <>
        <div className="row">
          <div className="col-6">
            <div>
              Name : <span className="h6 text-danger">{det.nomineeName}</span>
            </div>
            <div>
              Gender : <span className="h6 text-danger">{det.gender}</span>
            </div>
            <div>
              Joint Signatory :{" "}
              <span className="h6 text-danger">
                {det.jointsignatory ? "Yes" : "No"}
              </span>
            </div>
          </div>
          <div className="col-6">
            <div>
              Relationship :{" "}
              <span className="h6 text-danger">{det.relationship}</span>
            </div>
            <div>
              DOB : <span className="h6 text-danger">{det.dob}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  getDetails(det) {
    if (det.gender) {
      return (
        <>
          <div className="text-center">
            <h4>Customer Details</h4>
          </div>
          <div className="row">
            <div className="col-6">
              <div>
                Username : <span className="h6 text-info">{det.username}</span>
              </div>
              <div>
                Gender : <span className="h6 text-danger">{det.gender}</span>
              </div>
              <div>
                State : <span className="h6 text-danger">{det.state}</span>
              </div>
              <div>
                Role : <span className="h6 text-danger">{det.role}</span>
              </div>
            </div>
            <div className="col-6">
              <div>
                PAN : <span className="h6 text-danger">{det.PAN}</span>
              </div>
              <div>
                DOB : <span className="h6 text-danger">{det.dob}</span>
              </div>
              <div>
                City : <span className="h6 text-danger">{det.city}</span>
              </div>
              {det.addressLine1 && (
                <div>
                  Address Line :{" "}
                  <span className="h6 text-danger">{det.addressLine1}</span>
                </div>
              )}{" "}
              {
                <div>
                  <span className="h6 text-danger">
                    {det.addressLine2 && det.addressLine2}
                  </span>
                </div>
              }
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="text-center">
            <span className="h6 text-danger">
              *Customer Full Details not available
            </span>
          </div>
          <div>
            Username : <span className="h6 text-info">{det.username}</span>
          </div>
        </>
      );
    }
  }

  render() {
    const { modal, nominee } = this.state;
    const { modalIsOpen, username, detail } = modal;
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "500px",
      },
    };
    return (
      <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          // onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-5">
              <h2>{detail.name}</h2>
            </div>
            <div className="col-5">
              <div className="text-center"></div>
            </div>
            <div className="col-1"></div>
            <div className="col-1">
              <Tooltip title="Close Window">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.closeModal}
                >
                  X
                </button>
              </Tooltip>
            </div>
          </div>
          <hr />
          {this.getDetails(detail)}
          <hr />
          <div className="text-center">
            {nominee ? (
              <h4>Nominee Details</h4>
            ) : (
              <span className="h6 text-danger text-center">
                * Nominee Details not added yet
              </span>
            )}
          </div>
          {nominee && this.getNominee()}
        </Modal>
      </div>
    );
  }
}

export default CustomerDetailModel;
