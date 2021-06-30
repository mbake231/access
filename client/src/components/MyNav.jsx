import React, { Component } from 'react';
import { Link } from "react-router-dom";

import {
  Navbar, 
  NavItem,
  Button,
  Nav
} from 'react-bootstrap';
import axios from 'axios';
require('dotenv').config();

class MyNav extends Component {
  constructor(){
    super();
    this.onLoginClick=this.onLoginClick.bind(this)
  }


  loginModalRef = ({handleShow}) => {
    this.showModal = handleShow;
 }

 
 onLoginClick  ()  {
   
 }

 handleClick() {
   console.log('click');
 }

 logOutClick() {
  var url;
  if(process.env.NODE_ENV === 'production')
    url='https://www.thelocalgame.com/logout';
  else
    url='http://localhost:3000/logout';

    const response =  axios.post(url, {},{withCredentials: true});
    setTimeout(
      function() {
        window.location.reload();
      }
      .bind(this),
      500
  );

 }



    render() { 
      let button;
      if(this.props.username==null){
        button= <Button href='/login'>Login</Button>
      }
      else {
        button = <div>
                    Welcome {this.props.username} 
                    <a href={'/profile'}>Profile</a>
                    <a href={'/forum/'}>List</a>
                    <Button variant="outline-primary" onClick={this.logOutClick}>Logout</Button>
                </div>
      }
        return (
        <Navbar>
            <Navbar.Brand href="/">access.</Navbar.Brand>
            <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                {button}
              </Navbar.Collapse>
          </Navbar>);
    }
}
 
export default MyNav;