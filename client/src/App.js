import React, { Component } from 'react';
import './App.css';
import { BrowserRouter,Route,Switch,Link } from "react-router-dom";
import Login from './containers/Login';
import Home from './containers/Home';
import ListView from './containers/ListView';
import View from './containers/View';
import Register from './containers/Register';
import axios from 'axios';
import MyNav from './components/MyNav';
import Profile from './containers/Profile';

import ReactDOM from "react-dom";
require('dotenv').config()

class App extends Component {
  constructor() {
    super();
    this.state = {
        username:null,
        uid:null
    }
    this.login = this.login.bind(this);
    this.getData = this.getData.bind(this);
  };

  componentDidMount() {
      this.getData();
  }

  async getData (){
  
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
      }).then( response => { 
        if (response) {
          this.setState({username:response.data.username});
          this.setState({uid:response.data.uid});
          console.log(response.data)
          
        }
        return response;
    }) 
  }



  async login(email, password) {
    var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/login';
    const response = await axios.post(url, {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    })
    if (response) {
      document.cookie = `nodebb=${response.data}`
      this.setState({
        username:email
      }, async () => {
        //after get username then add uid and data to state with another call
              var userurl;
              if (process.env.NODE_ENV === 'production')
              userurl = 'https://www.thelocalgame.com/login';
              else
              userurl = process.env.FORUM_URL+'/api/user/'+this.state.username;
                         
              const response =  await axios.get(userurl, {
                withCredentials: true
              }).catch(error => {
                if (error)
                  this.setState({
                    showLoginError: true
                  })
              })
              if (response) {
                this.setState({
                  uid:response.data.uid
                }, () => {console.log(this.state)});
              }
      
            });
    }


  }

render() {
  return (
    <div id='master-content'>
    <BrowserRouter>
          <MyNav username={this.state.username} uid={this.state.uid}>
         
            
        </MyNav>
      
      <Switch>
        <Route path="/" exact render={(props) => <Home username={this.state.username} uid={this.state.uid} {...props}  />} />
        <Route path="/profile" exact render={(props) => <Profile username={this.state.username} uid={this.state.uid} {...props}  />} />
        <Route path="/login" exact render={(props) => <Login login={this.login.bind(this)} {...props}  />} />
        <Route path="/register" exact render={(props) => <Register {...props}  />} />
        <Route path="/view*" exact render={(props) => <View {...props}  />} />
        <Route exact path="/list" exact render={(props) => <ListView {...props}  />} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}
}
export default App;
