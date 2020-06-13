import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

class AddBook extends Component {
  constructor() {
    super();
    this.state = {
      name: undefined,
      rating: undefined,
      details: undefined,
    };
  }

  submitHandler = async (evt) => {
    evt.preventDefault();
    if (!this.state.name && !this.state.rating && !this.state.details) {
      alert("You need to complete the form");
      return;
    }

    let data = new FormData();
    data.append("name", this.state.name);
    data.append("rating", this.state.rating);
    data.append("details", this.state.details);

    let response = await fetch(this.props.HATEAOS._link.addBook.href, {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.history.push(this.props.HATEAOS._link.mainPage.href);
    } else {
      alert("error with the book");
    }
  };

  name = (evt) => {
    this.setState({ name: evt.target.value });
  };
  rating = (evt) => {
    this.setState({ rating: evt.target.value });
  };
  details = (evt) => {
    this.setState({ details: evt.target.value });
  };

  render = () => {
    console.log("HATEAOS:", this.props.HATEAOS);
    return (
      <div className="Firstpage-container">
        <div className="FirstPage-form">
          <h1>Add a book</h1>
          <form className="register-container" onSubmit={this.submitHandler}>
            <div className="register-input-container">
              <label>Name</label>
              <input onChange={this.name} />
            </div>
            <div className="register-input-container">
              <label>Rating</label>
              <input onChange={this.rating} type="number" max="10" min="0" />
            </div>
            <div className="register-input-container">
              <label>Details</label>
              <textarea
                rows="6"
                cols="20"
                maxLength="500"
                onChange={this.details}
              ></textarea>
            </div>
            <button type="submit" className="event-chat-submit">
              add
            </button>
            <Link
              to={this.props.HATEAOS._link.mainPage.href}
              className="return-button"
            >
              return
            </Link>
          </form>
        </div>
      </div>
    );
  };
}

export default withRouter(AddBook);
