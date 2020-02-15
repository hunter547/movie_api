import React from 'react';
import './profile-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class ProfileView extends React.Component {

  constructor() {
    super();

    this.name = null,
      this.username = null,
      this.password = null,
      this.email = null,
      this.birth_date = null

    this.state = {
      userinfo: null,
      validated: null,
      used: null,
      show: null,
      initial: true,
      onLogOut: null
    };
  }

  componentDidMount() {
    this.getUserInfo(localStorage.getItem('user'), localStorage.getItem('token'));
  }

  getUserInfo(user, token) {
    axios.get(`https://my-flix-api-evanoff.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userinfo: response.data
        })
      })
      .catch(error => {
        console.error(error);
      });
  }

  removeFavorite(e, movieID) {
    e.preventDefault();
    axios({
      method: 'delete',
      url: `https://my-flix-api-evanoff.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movieID}`,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        this.setState({
          userinfo: null
        })
        this.getUserInfo(localStorage.getItem('user'), localStorage.getItem('token'));
      })
      .catch(e => {
        console.error(e);
      });
  }

  updateUser(e, name, username, password, email, birth_date, userinfo) {
    this.setState({
      used: null,
      show: null,
      validated: null,
      initial: null
    })
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
        show: null
      })
      return;
    }
    e.preventDefault();
    axios({
      method: 'put',
      url: `https://my-flix-api-evanoff.herokuapp.com/users/${localStorage.getItem('user')}`,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      data: {
        name: name ? name : userinfo.name,
        username: username ? username : userinfo.username,
        password: password,
        email: email ? email : userinfo.email,
        birth_date: birth_date ? birth_date : userinfo.birth_date
      }

    })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            used: true,
            validated: true,
            show: null
          })
        }
        else {
          localStorage.setItem('user', response.data.username);
          this.setState({
            show: true
          })
        }
      })
      .catch(error => {

      })
  }

  deregisterUser(e) {
    e.preventDefault();
    axios({
      method: 'delete',
      url: `https://my-flix-api-evanoff.herokuapp.com/users/${localStorage.getItem('user')}`,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then(response => {
        this.props.onLogOut(true);
      })
      .catch(error => {
        console.error(error);
      })

  }

  setName(input) {
    this.name = input;
  }

  setUsernameAndUsed(input) {
    this.username = input;
    this.setState({
      used: null
    })
  }

  setPassword(input) {
    this.password = input;
  }

  setEmail(input) {
    this.email = input;
  }

  setBirthDate(input) {
    this.birth_date = input;
  }

  render() {

    const { userinfo, validated, used, show, initial } = this.state;
    const processPopover = (
      <Popover id="popover-process">
        <Popover.Title as="h3">Updating...</Popover.Title>
        <Popover.Content>
          <Spinner className="loader-spinner" animation="border" size="sm" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Popover.Content>
      </Popover>
    );
    const successPopover = (
      <Popover id="popover-success">
        <Popover.Title as="h3">Success</Popover.Title>
        <Popover.Content>
          Your infomation was updated.
        </Popover.Content>
      </Popover>
    );
    if (!userinfo) return <Spinner className="loader-spinner" animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>;
    return (
      <Container className="profile-view" fluid="true">
        <h1 className="myflix-title">Update Profile</h1>
        <Form noValidate validated={validated} onSubmit={(e) => this.updateUser(e, this.name, this.username, this.password, this.email, this.birth_date, userinfo)} className="profile-form">
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" defaultValue={userinfo.name} required onChange={e => this.setName(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" defaultValue={userinfo.username} pattern="^[a-zA-Z0-9]{5,}" required onChange={e => this.setUsernameAndUsed(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please choose a username that's at least 5 characters and is alphanumeric.
            </Form.Control.Feedback>
            {!used ? null
              :
              <Form.Text className="incorrect-text">
                Username is already being used.
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter a new password" defaultValue="" required onChange={e => this.setPassword(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" defaultValue={userinfo.email} pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$" required onChange={e => this.setEmail(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter an email in the correct format.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your credentials or email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control type="date" placeholder="Enter birthdate" min="1900-01-01" max={new Date().toISOString().split('T')[0]} required defaultValue={userinfo.birth_date.split('T')[0]} onChange={e => this.setBirthDate(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter a birthdate.
            </Form.Control.Feedback>
          </Form.Group>
          {show ?
            <OverlayTrigger defaultShow placement="right" overlay={successPopover}>
              <Button className="update-button" variant="primary" type="submit">Update</Button>
            </OverlayTrigger>
            :
            validated ?
              <Button className="update-button" variant="primary" type="submit">Update</Button>
            :
            initial ?
              <Button className="update-button" variant="primary" type="submit">Update</Button>
            :
            <OverlayTrigger defaultShow placement="right" overlay={processPopover}>
              <Button className="update-button" variant="primary" type="submit">Update</Button>
            </OverlayTrigger>
          }
        </Form>
        <Container className="profile-view" fluid="true">
          <h1 className="myflix-title">Favorite Movies</h1>
          <ListGroup className="favorites-groups" variant="flush">
            {userinfo.favorite_movies.length === 0 && <ListGroup.Item>You have no favorite movies.</ListGroup.Item>}
            {userinfo.favorite_movies.map(movie => {
              return (<ListGroup.Item key={movie.title} className="favorite-movies">
                <div>
                  {movie.title}
                </div>
                <div className="delete-div">
                  <Button className="delete-button" key={movie._id} onClick={(e) => this.removeFavorite(e, movie._id)}>Delete</Button>
                </div>
              </ListGroup.Item>)
            })
            }
          </ListGroup>
        </Container>
        <Container className="profile-view" fluid="true">
          <h1 className="deregister-group">Deregister</h1>
          <ListGroup className="deregister-list-group" variant="flush">
            <Button className="deregister-button" onClick={(e) => this.deregisterUser(e)}>Deregister Account</Button>
          </ListGroup>
        </Container>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  userinfo: PropTypes.shape({
    favorite_movies: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      })
    ),
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    birth_date: PropTypes.string.isRequired
  })
}
