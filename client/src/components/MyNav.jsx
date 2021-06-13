import React, { Component } from 'react';
import { Link } from "react-router-dom";

import {
  Navbar, 
  NavItem,
  Button,
  Nav
} from 'react-bootstrap';
import axios from 'axios';

class MyNav extends Component {
  constructor(){
    super();
    this.onLoginClick=this.onLoginClick.bind(this)
  }


  loginModalRef = ({handleShow}) => {
    this.showModal = handleShow;
 }

 
 onLoginClick  ()  {
   this.props.toggleLoginModal();
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
        button= <Button onClick={this.onLoginClick}>Login</Button>
      }
      else {
        button = <div>
                    Welcome {this.props.username} 
                    <Link variant="outline-primary" to={'/forum/user/'+this.props.username}>Profile</Link>
                    <Button variant="outline-primary" onClick={this.logOutClick}>Logout</Button>
                </div>
      }
        return (
        <Navbar>
            <Navbar.Brand href="#home">access.</Navbar.Brand>
            <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                {button}
              </Navbar.Collapse>
          </Navbar>);
    }
}
 
export default MyNav;