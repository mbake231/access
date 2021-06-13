
import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-tiny-fab/dist/styles.css';
require('dotenv').config();
class Home extends Component{
  constructor(props) {
  super(props);
  this.state = {
    uid:null,
    recenttopics:{topics:[]},
    generaltopics:{topics:[]}
  }



};

componentDidUpdate(prevProps) {

  if(prevProps.uid != this.props.uid) {
    this.setState({uid: this.props.uid},
      () => {
        this.getHomeForumData();
      }
      
      );
  }
}




async getHomeForumData (){
  console.log('uid:'+this.state.uid)
  var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/home';
    const response = await axios.post(url, {uid:this.state.uid},{
      withCredentials: true
    }
  ).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    }).then( response => { 
      if (response) {
        this.setState({recenttopics:response.data.recent});
        this.setState({generaltopics:response.data.general});
        console.log(response.data);
        
      }
      return response;
  }) 
}

handleAddListClick() {

}

async getChecklists (){
  
  var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/user';
    const response = await axios.post(url, {},{
      withCredentials: true
    }
  ).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    }).then( function(response) { 
      if (response) {
        console.log(response);
      
        
      }
      return response;
  })
    
      
  }



 render(){

    return (
        <div>
            <Form.Group>
            <GooglePlacesAutocomplete
               apiKey={process.env.PLACES_API}
               />
            </Form.Group>
            <ListGroup>
            
                <ListGroup.Item variant="primary">General Travel Adivsor Forum</ListGroup.Item>
            {this.state.generaltopics.topics.map((list,i) => {
                return <Link >
                    <ListGroup.Item>{this.state.generaltopics.topics[i].title}</ListGroup.Item>
                        </Link>
            })}
            </ListGroup>

            <ListGroup>
            
                <ListGroup.Item variant="primary">General Travel Adivsor Forum</ListGroup.Item>
            {this.state.recenttopics.topics.map((list,i) => {
                return <Link >
                    <ListGroup.Item>{this.state.recenttopics.topics[i].title}</ListGroup.Item>
                        </Link>
            })}
            </ListGroup>
        </div>
        )
    }
}
export default Home 
