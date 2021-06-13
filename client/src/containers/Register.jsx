import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { useHistory } from "react-router-dom";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const history = useHistory();


function handleSubmit(e) {
  e.preventDefault();
    
  var cb = props.postRegLogin;
    loginUser(cb, function(response) {
        cb('');
        console.log(response);
    });
}

function loginUser (data, callback){
  
  var url;
    if(process.env.NODE_ENV === 'production')
      url='https://www.thelocalgame.com/register';
    else
      url='http://localhost:3000/register';
  console.log(email+' '+password);
  axios.post(url,{
    email:email,
    password:password,
    confirmpassword:confirmpassword},
    {withCredentials: true}
  ).then(response =>{
    history.push("/");
    callback(response.data);
  }).catch(err =>{
    console.log(err);
  })
}


    return (
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>User name</Form.Label>
              <Form.Control type="username" 
              placeholder="Username" 
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
            
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" 
              placeholder="Confirm Password" 
              onChange={e => setConfirmPassword(e.target.value)}
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

