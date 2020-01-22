import React, { useState } from 'react';
import './registration-view.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function RegistrationView(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birth_date, setBirthDate] = useState('');

  const handleSubmit = () => {
    console.log(name, username);
    /* Send a request to the server for authentication */
    props.onNeedRegistration(false);
  };


  return (
    <div className="registration-view">
      <h1 className="myflix-title">myFlix API Registration</h1>
      <Form className="registration-form">
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your credentials or email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control type="date" placeholder="Enter birthdate" value={birth_date} onChange={e => setBirthDate(e.target.value)} />
        </Form.Group>
        <Button className="submit-button" variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}
