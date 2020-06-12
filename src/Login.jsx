import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: undefined,
      password: undefined,
    };
  }

  submitHandler = async (evt) => {
    evt.preventDefault();
    if (!this.state.username && !this.state.password) {
      alert("You need to complete the form");
      return;
    }

    let response = await fetch(
      `http://localhost:4000/login/${this.state.username}/${this.state.password}`
    );
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.setupHATEAOS(parsed.HATEOAS);
      this.props.history.push(parsed.HATEOAS._link.mainPage.href);
    } else {
      alert("error with the login");
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
          <h1>Login</h1>
          <form className="register-container" onSubmit={this.submitHandler}>
            <div className="register-input-container">
              <label>Username</label>
              <input onChange={this.username} />
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

export default withRouter(Login);
