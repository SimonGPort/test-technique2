import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
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
      console.log("books updated");
      this.setState({ books: body.books });
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

  render = () => {
    let options = [
      <div key="option">
        <div>Books App</div>
        <div className="option-container-main">
          {this.props.HATEAOS._link.addBook !== undefined ? (
            <div className="option-main">
              <Link to={this.props.HATEAOS._link.addBook.href}>add a book</Link>
            </div>
          ) : (
            ""
          )}
          <div className="option-main">
            <input></input>
          </div>
          {this.props.HATEAOS._link.updateProfil !== undefined ? (
            <div className="option-main">
              <Link to={this.props.HATEAOS._link.updateProfil.href}>
                Update Profil
              </Link>
            </div>
          ) : (
            ""
          )}
          {this.props.HATEAOS._link.logOut !== undefined ? (
            <div className="option-main">
              <button onClick={this.logout}>Log out</button>
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
            <Link to={this.props.HATEAOS._link.edit.href + "/" + book.id}>
              Edit
            </Link>
            <button
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
              <th>Name</th>
              <th>Rating</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </table>
      </div>
    );
  };
}

export default withRouter(MainPage);
