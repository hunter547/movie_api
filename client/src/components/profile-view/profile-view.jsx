import React from 'react';
import './profile-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class ProfileView extends React.Component {

  constructor() {
    super();

    this.name = null
    this.username = null,
      this.password = null,
      this.email = null,
      this.birth_date = null

    this.state = {
      userinfo: null,
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
        alert(response.data);
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
        alert('Your account has been updated');
      })
      .catch(error => {
        alert(error);
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
        alert(response.data + ' You will now be taken back to the login screen.');
        this.props.onLogOut(true);
      })
      .catch(error => {
        console.error(error);
      })

  }

  setName(input) {
    this.name = input;
  }

  setUsername(input) {
    this.username = input;
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

    const { userinfo } = this.state;
    if (!userinfo) return <div className="loader">Loading...</div>;
    return (
      <Container className="profile-view" fluid="true">
        <h1 className="myflix-title">Update Profile</h1>
        <Form className="profile-form">
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" defaultValue={userinfo.name} onChange={e => this.setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" defaultValue={userinfo.username} onChange={e => this.setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter a new password" defaultValue="" onChange={e => this.setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" defaultValue={userinfo.email} onChange={e => this.setEmail(e.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your credentials or email with anyone else.
          </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control type="date" placeholder="Enter birthdate" defaultValue={userinfo.birth_date.split('T')[0]} onChange={e => this.setBirthDate(e.target.value)} />
          </Form.Group>
          <div className="form-buttons">
            <div>
              <Button className="update-button" variant="primary" type="button" onClick={(e) => this.updateUser(e, this.name, this.username, this.password, this.email, this.birth_date, userinfo)}>Update</Button>
            </div>
            <div>
              <Link to={`/`}>
                <Button className="update-button">Go Back</Button>
              </Link>
            </div>
          </div>
        </Form>
        <Container className="profile-view" fluid="true">
          <h1 className="myflix-title">Favorite Movies</h1>
          <ListGroup className="myflix-title" variant="flush">
            {userinfo.favorite_movies.length === 0 && <ListGroup.Item>You have no favorite movies.</ListGroup.Item>}
            {userinfo.favorite_movies.map(movie => {
              return (<ListGroup.Item className="favorite-movies">
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
