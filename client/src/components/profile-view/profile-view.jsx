import React, { useState } from 'react';
import './profile-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function ProfileView(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const userinfo = () => {
    axios.get(`https://my-flix-api-evanoff.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: {Authorization: `${localStorage.getItem('token')}`}
    })
    .then( response => {
      return response.data;
    } )
    .catch( err => {
      console.error(err);
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(name, username);
    /* Send a request to the server for authentication */
    axios.post('https://my-flix-api-evanoff.herokuapp.com/users', {
      name: name,
      username: username,
      password: password,
      email: email,
      birth_date: birth_date
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self');
      })
      .catch(e => {
        console.log(e);
      });
  };


  return (
    <Container className="profile-view" fluid="true">
      <h1 className="myflix-title">Update Profile</h1>
      <Form className="profile-form">
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" defaultValue={userinfo.name} onChange={e => setName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" defaultValue={userinfo.username} onChange={e => setUsername(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter a new password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" defaultValue={userinfo.email} onChange={e => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your credentials or email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control type="date" placeholder="Enter birthdate" defaultValue={userinfo.birth_date.split('T')[0]} onChange={e => setBirthDate(e.target.value)} />
        </Form.Group>
        <Button className="submit-button" variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
      </Form>
      <Container className="profile-view" fluid="true">
        <h1 className="myflix-title">Favorite Movies</h1>
        <ListGroup className="myflix-title" variant="flush">
          {userinfo.favorite_movies.map(movie => {
                return <ListGroup.Item>{movie.title}</ListGroup.Item>
              })
          }
        </ListGroup>
      </Container>
    </Container>
  );
}
