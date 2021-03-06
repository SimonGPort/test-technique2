import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      filterInput: "",
    };
  }

  componentDidMount() {
    this.fetchBooks();
  }
  fetchBooks = async () => {
    let response = await fetch(this.props.HATEAOS._link.fetchBooks.href);
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      let bookFilted = body.books.filter((book) => {
        return book.name.includes(this.state.filterInput);
      });
      this.setState({ books: bookFilted });
    }
  };

  logout = async () => {
    let response = await fetch(this.props.HATEAOS._link.logOut.href, {
      method: "POST",
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.history.push("/");
      this.props.setupHATEAOS(undefined);
    }
  };
  modifyBookHandle = (id) => {
    console.log("hello world", id);
  };

  deleteBookHandle = async (id) => {
    console.log("delete:", this.props.HATEAOS._link.delete.href + "/" + id);
    let response = await fetch(
      this.props.HATEAOS._link.delete.href + "/" + id,
      {
        method: "POST",
      }
    );
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      let newBooks = this.state.books.filter((book) => book.id !== id);
      this.setState({ books: newBooks });
    }
  };

  submitHandler = (evt) => {
    evt.preventDefault();
    this.fetchBooks();
  };

  render = () => {
    let options = [
      <div key="option">
        <h1>Books App</h1>
        <div className="option-container-main">
          {this.props.HATEAOS._link.addBook !== undefined ? (
            <div className="option-main">
              <Link
                to={this.props.HATEAOS._link.addBook.href}
                className="button-style"
              >
                Add a book
              </Link>
            </div>
          ) : (
            ""
          )}
          <div className="option-main">
            <form onSubmit={this.submitHandler}>
              <input
                className="input-filter"
                onChange={(evt) => {
                  this.setState({ filterInput: evt.target.value });
                }}
              ></input>
              <button type="submit" className="button-style">
                Search
              </button>
            </form>
          </div>
          {this.props.HATEAOS._link.updateProfil !== undefined ? (
            <div className="option-main">
              <Link
                to={this.props.HATEAOS._link.updateProfil.href}
                className="button-style"
              >
                Update Profil
              </Link>
            </div>
          ) : (
            ""
          )}
          {this.props.HATEAOS._link.logOut !== undefined ? (
            <div className="option-main">
              <button onClick={this.logout} className="button-style">
                Log out
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>,
    ];

    let books = this.state.books.map((book, idx) => {
      return (
        <tr key={idx}>
          <td>{book.name}</td>
          <td>{book.rating}</td>
          <td>{book.details}</td>
          <td>
            <Link
              to={this.props.HATEAOS._link.edit.href + "/" + book.id}
              className="button-style"
              style={{ marginRight: "10px" }}
            >
              Edit
            </Link>
            <button
              className="button-style"
              onClick={() => {
                this.deleteBookHandle(book.id);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        {options}
        <table className="table-main">
          <thead>
            <tr>
              <td>
                <h3>Name</h3>
              </td>
              <td>
                <h3>Rating</h3>
              </td>
              <td>
                <h3>Details</h3>
              </td>
              <td>
                <h3>Actions</h3>
              </td>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </table>
      </div>
    );
  };
}

export default withRouter(MainPage);
