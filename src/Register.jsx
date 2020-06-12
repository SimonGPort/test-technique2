import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class FirstPage extends Component {
  constructor() {
    super();
    this.state = {
      username: undefined,
      email: undefined,
      password: undefined,
    };
  }

  submitHandler = async (evt) => {
    evt.preventDefault();
    if (!this.state.username && !this.state.email && !this.state.password) {
      alert("You need to complete the form");
      return;
    }

    let data = new FormData();
    data.append("username", this.state.username);
    data.append("email", this.state.email);
    data.append("password", this.state.password);

    let response = await fetch("/register", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.setupHATEAOS(parsed.HATEOAS);

      this.props.history.push(parsed.HATEOAS._link.mainPage.href);
    } else {
      alert("error with the registery");
    }
  };

  username = (evt) => {
    this.setState({ username: evt.target.value });
  };
  email = (evt) => {
    this.setState({ email: evt.target.value });
  };
  password = (evt) => {
    this.setState({ password: evt.target.value });
  };

  render = () => {
    return (
      <div className="Firstpage-container">
        <div className="FirstPage-form">
          <h1>Register</h1>
          <form className="register-container" onSubmit={this.submitHandler}>
            <div className="register-input-container">
              <label>Username</label>
              <input onChange={this.username} />
            </div>
            <div className="register-input-container">
              <label>Email</label>
              <input onChange={this.email} />
            </div>
            <div className="register-input-container">
              <label>Password</label>
              <input onChange={this.password} />
            </div>
            <button type="submit" className="event-chat-submit">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  };
}

export default withRouter(FirstPage);
