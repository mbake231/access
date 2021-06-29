
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
        item_id:null,
        item_data: {name:null,website:null,address:null}
  }
   
  

};



componentDidMount(){
    this.setState({item_id:window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}, () => {
        this.getHomeItemData();
    });
}



async getHomeItemData() {
    var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/item';
    const response = await axios.post(url, { item_id: this.state.item_id }, {
      withCredentials: true
    }
    ).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    }).then(response => {
      if (response) {
        this.setState({ item_data: response.data });
        //this.setState({ generaltopics: response.data.general });
        console.log(response.data);

      }
      return response;
    })
  }

 


 render(){

    return (
        <div>
            Name:{this.state.item_data.name} <br></br>
            Address: {this.state.item_data.address}<br></br>
            Website: <a href={this.state.item_data.website} target="_blank">Click here</a>
            
   
                 
        </div>
        )
    }
}
export default Profile 
