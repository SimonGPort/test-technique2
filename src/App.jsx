import React, { Component } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import FirstPage from "./FirstPage.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
// import Navbar from "./Navbar.jsx";
import MainPage from "./MainPage.jsx";
import AddBook from "./addBook.jsx";
import UpdateProfil from "./UpdateProfil.jsx";
import ModifyBook from "./ModifyBook.jsx";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      HATEAOS: undefined,
    };
  }

  componentDidMount() {
    this.autoLogin();
  }

  autoLogin = async () => {
    let response = await fetch("/autoLogin", { method: "POST" });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.setupHATEAOS(body.HATEOAS);
      this.props.history.push(body.HATEOAS._link.mainPage.href);
      console.log("ici");
    }
  };

  FirstPage = () => {
    console.log("firstpage");
    return <FirstPage setupHATEAOS={this.setupHATEAOS} />;
  };

  register = () => {
    return <Register setupHATEAOS={this.setupHATEAOS} />;
  };

  login = () => {
    return <Login setupHATEAOS={this.setupHATEAOS} />;
  };

  mainPage = (routeProps) => {
    if (!this.state.HATEAOS) {
      return;
    }

    return (
      <MainPage
        user={routeProps.match.params.user}
        HATEAOS={this.state.HATEAOS}
        setupHATEAOS={this.setupHATEAOS}
      />
    );
  };

  addBook = (routeProps) => {
    if (!this.state.HATEAOS) {
      return;
    }
    return (
      <AddBook
        user={routeProps.match.params.user}
        HATEAOS={this.state.HATEAOS}
      />
    );
  };

  ModifyBook = (routeProps) => {
    if (!this.state.HATEAOS) {
      return;
    }

    return (
      <ModifyBook
        user={routeProps.match.params.user}
        HATEAOS={this.state.HATEAOS}
        id={routeProps.match.params.id}
      />
    );
  };

  updateProfil = (routeProps) => {
    if (!this.state.HATEAOS) {
      return;
    }

    return (
      <UpdateProfil
        user={routeProps.match.params.user}
        HATEAOS={this.state.HATEAOS}
        setupHATEAOS={this.setupHATEAOS}
      />
    );
  };

  setupHATEAOS = (evt) => {
    this.setState({ HATEAOS: evt });
  };

  render = () => {
    return (
      <BrowserRouter>
        <Route exact={true} path="/" render={this.FirstPage} />
        <Route exact={true} path="/register" render={this.register} />
        <Route exact={true} path="/login" render={this.login} />

        <Route
          path="/mainPage/:user"
          render={(routeProps) => this.mainPage(routeProps)}
        />
        <Route
          path="/addBook/:user"
          render={(routeProps) => this.addBook(routeProps)}
        />
        <Route
          path="/updateProfil/:user"
          render={(routeProps) => this.updateProfil(routeProps)}
        />
        <Route
          path="/edit/:user/:id"
          render={(routeProps) => this.ModifyBook(routeProps)}
        />
      </BrowserRouter>
    );
  };
}

export default withRouter(App);
