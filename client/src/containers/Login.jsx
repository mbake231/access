import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

function handleSubmit(e) {
  e.preventDefault();
  props.login(email,password);
  
}

    return (
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="text" 
              placeholder="Enter email" 
              onChange={e => setEmail(e.target.value)}
                />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" 
              placeholder="Password" 
              onChange={e => setPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
        )
    }

