import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadReviews, addReview } from '../actions/reviewActions.js';
import { loadUsers } from '../actions/userActions.js';
import { Link } from 'react-router-dom';

class Home extends Component {
  state = {
    reviewToEdit: {
      txt: '',
      aboutUserId: ''
    }
  };
  componentDidMount() {
    this.props.loadReviews();
    this.props.loadUsers();
  }

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState(prevState => ({
      reviewToEdit: {
        ...prevState.reviewToEdit,
        [name]: value
      }
    }));
  };

  addReview = ev => {
    ev.preventDefault();
    this.props.addReview(this.state.reviewToEdit);
    this.setState({ reviewToEdit: { txt: '', aboutUserId: '' } });
  };

  render() {
    return (
      <div className="home">
        {this.props.reviews && <ul>
          {this.props.reviews.map(review => (
            <li key={review._id}>
              <h3>{review.txt}</h3>
              <p>
                <Link to={`user/${review.aboutUser._id}`}>
                  About {review.aboutUser.username}
                </Link>
              </p>
              <p>
                <Link to={`user/${review.byUser._id}`}>
                  By {review.byUser.username}
                </Link>
              </p>
              <hr />
            </li>
          ))}
        </ul>}
        {this.props.users && this.props.loggedInUser &&
          <form onSubmit={this.addReview}>
            <select
              onChange={this.handleChange}
              value={this.state.reviewToEdit.aboutUserId}
              name="aboutUserId"
            >
              <option value="">Select User</option>
              {this.props.users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            <textarea
              name="txt"
              onChange={this.handleChange}
              value={this.state.reviewToEdit.txt}
            ></textarea>
            <button>Submit</button>
          </form>}
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reviews: state.review.reviews,
    users: state.user.users,
    loggedInUser: state.user.loggedInUser
  };
};
const mapDispatchToProps = {
  loadReviews,
  loadUsers,
  addReview
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
