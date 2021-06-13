import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from "react-router-dom";
import axios from 'axios';
import AddList from '../components/AddList.jsx';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

class Home extends Component{
  constructor(props) {
  super(props);
  this.state = {
    uid:null,
    homedata:{}
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
        this.setState({homedata:response.data.homedata});
        
        console.log(response.data)
        
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

            <ListGroup>
                <ListGroup.Item variant="primary">Daily Checklists {this.props.username}</ListGroup.Item>

            </ListGroup>
        </div>
        )
    }
}
export default Home 
