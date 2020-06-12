import React, { Component } from "react";
import { Link } from "react-router-dom";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  render = () => {
    let options = [
      <div key="option">
        <div>Books App</div>
        <div className="option-container-main">
          {this.props.HATEAOS._link.addBook !== undefined ? (
            <div className="option-main">
              <button />
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
              <Link to={this.props.HATEAOS._link.logOut.href}>Log out</Link>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>,
    ];
    let books = [
      <tr>
        <td>Hello world</td>
      </tr>,
    ];

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

export default MainPage;
