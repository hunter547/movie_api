import React, { useState } from 'react';
import axios from 'axios';
import './login-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('https://my-flix-api-evanoff.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log(e);
      });
  };


  return (
    <Container className="login-view" fluid="true">
      <h1 className="myflix-title">myFlix API Login</h1>
      <Form className="login-form">
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your credentials with anyone else.
          </Form.Text>
        </Form.Group>
        <Button className="submit-button" variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
        <Form.Group className="registration-group" controlId="formRegistration">
          <Form.Text className="text-muted">Don't have an account?</Form.Text>
          <Link to={`/register`}>
            <Button className="register-link">Register here</Button>
          </Link>
        </Form.Group>
      </Form>
    </Container>
  );
}
