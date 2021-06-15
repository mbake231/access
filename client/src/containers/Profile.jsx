
import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { BrowserRouter,Switch, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-tiny-fab/dist/styles.css';
import Iframe from 'react-iframe'

require('dotenv').config();
class Profile extends Component{
  constructor(props) {
  super(props);
  this.state = {
    uid:null,
    recenttopics:{topics:[]},
    generaltopics:{topics:[]},
    divStyle: {  width: "100%", height: "500px",frameBorder:'0', zindex:'-999'},
    forum_url:process.env.REACT_APP_FORUM_URL
  }
   


};


      
  

 


 render(){

    return (
        <div>
            
            
           <div id='general' style={this.state.divStyle}>
              <Iframe url={process.env.REACT_APP_FORUM_URL+"/user/"+this.props.username}
                width="100%"
                height="100%"
                id="myId"
                className="myClassname"
                display="initial"
                position="relative"
                styles={{marginTop:"-1000px"}}
                />
            </div>
                 
        </div>
        )
    }
}
export default Profile 
