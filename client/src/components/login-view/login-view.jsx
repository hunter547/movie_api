import React, { useState } from 'react';
import './login-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(username, password);
    /* Send a request to the server for authentication */
    props.onLoggedIn(username);
  };

  const handleRegistration = () => {
    props.onNeedRegistration(true);
  };


  return (
    <div className ="login-view">
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
          <a className="register-link" onClick={handleRegistration}>Register here</a>
        </Form.Group>
      </Form>
    </div>
  );
}
