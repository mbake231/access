
import React, { Component } from 'react';
import CreateReview from '../components/CreateReview.jsx'
import ListGroup from 'react-bootstrap/ListGroup'
import { BrowserRouter,Switch, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-tiny-fab/dist/styles.css';
import Iframe from 'react-iframe'
import {
    Button
  } from 'react-bootstrap';

require('dotenv').config();
class Profile extends Component{
  constructor(props) {
  super(props);
  this.state = {
        item_id:null,
        item_data: {name:null,website:null,address:null,reviews:[{scores:{food:null}}]},
        showCreateReviewModal:false
  }
  this.toggleCreateReviewModal = this.toggleCreateReviewModal.bind(this);
};



componentDidMount(){
    this.setState({item_id:window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}, () => {
        this.getHomeItemData();
    });
    
}

toggleCreateReviewModal() {
    this.setState({showCreateReviewModal:!this.state.showCreateReviewModal});

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
        console.log(response.data);
        this.setState({ item_data: response.data });
        //this.setState({ generaltopics: response.data.general });
        

      }
      return response;
    })
  }

 


 render(){

    return (
        <div>
            <CreateReview item_id={this.state.item_id} review_cid={this.state.item_data.review_cid} showCreateReviewModal={this.state.showCreateReviewModal} toggleCreateReviewModal={this.toggleCreateReviewModal.bind(this)}></CreateReview>
            Name:{this.state.item_data.name} <br></br>
            Address: {this.state.item_data.address}<br></br>
            Website: <a href={this.state.item_data.website} target="_blank">Click here</a>
            <ListGroup>

                <ListGroup.Item variant="primary">Reviews
                <Button onClick={this.toggleCreateReviewModal}>Add review</Button>
                </ListGroup.Item>
                {this.state.item_data.reviews ? (
                this.state.item_data.reviews.map((list, i) => {
                     
                    return  <ListGroup.Item>
                        Date:{this.state.item_data.reviews[i].timestamp}<br></br>
                        Username: {this.state.item_data.reviews[i].username} <br></br>
                        Food:{parseInt(this.state.item_data.reviews[i].scores.food_score)}<br></br>
                        Rooms:{parseInt(this.state.item_data.reviews[i].scores.room_score)}<br></br>
                        Service:{parseInt(this.state.item_data.reviews[i].scores.service_score)}<br></br>
                        Review Title:{this.state.item_data.reviews[i].review_title}<br></br>
                        Review Body:{this.state.item_data.reviews[i].scores.review_body}
                        </ListGroup.Item>
                   
                }))
                :( <div>No reviews</div> )}
                    
                
                </ListGroup>

        <ListGroup></ListGroup>

                 
        </div>
        )
    }
}
export default Profile 
