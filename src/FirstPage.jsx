import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class FirstPage extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.autoLogin();
  }

  autoLogin = async () => {
    let response = await fetch("/autoLogin", { method: "POST" });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.setupHATEAOS(body.HATEOAS);
      this.props.history.push(body.HATEOAS._link.mainPage.href);
      console.log("ici");
    }
  };

  render = () => {
    return (
      <div className="Firstpage-container">
        <div className="FirstPage-form">
          <h1>Book application</h1>
          <Link to="/register" className="Firstpage-boutton">
            Register
          </Link>

          <Link to="/login" className="Firstpage-boutton">
            Log in
          </Link>
        </div>
      </div>
    );
  };
}

export default withRouter(FirstPage);
