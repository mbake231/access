
import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from "react-router-dom";
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-tiny-fab/dist/styles.css';
import SearchBar from 'material-ui-search-bar';

require('dotenv').config();
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      recenttopics: [],
      generaltopics: { topics: [] },
      divStyle: { width: "1000px", height: "400px", overflow: "hidden", top: "-1000px" },
      forum_url: process.env.REACT_APP_FORUM_URL,
      place_id:null
    }
  };

  componentDidMount() {
    this.handleScriptLoad();
    this.getRecentReviews();
  }

  componentDidUpdate(prevProps) {

    if (prevProps.uid != this.props.uid) {
      this.setState({ uid: this.props.uid },
        () => {
          this.getRecentReviews();
        }

      );
    }

    if(this.state.place_id!==null)
      this.findPlacePage(this.state.place_id);
  }

  async getRecentReviews() {
    console.log('uid:' + this.state.uid)
    var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/recentreviews';
    const response = await axios.post(url, { uid: this.state.uid }, {
      withCredentials: true
    }
    ).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    }).then(response => {
      if (response) {
        var data = response.data;
        data.map((list,i) => {
          var code = data[i].category.name;
          console.log(code)
          console.log(code.indexOf(' &#x2F; '))
          data[i].category.name = code.substring(0,code.indexOf(' &#x2F; '))
          data[i]['place_id']=code.substring(code.indexOf(' &#x2F; ')+8)
        })
        console.log(data)
        this.setState({ recenttopics: data });
      }
    })
  }

  handleScriptLoad() {
    // Declare Options For Autocomplete 
    const options = {};

    // Initialize Google Autocomplete 
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options);
    // Avoid paying for data that you don't need by restricting the 
    // set of place fields that are returned to just the address
    // components and formatted address
    this.autocomplete.setFields(['place_id']);
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed',
      this.handlePlaceSelect);
  }
  handlePlaceSelect = () => {
    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const pid = addressObject.place_id;
    // Check if pid is valid
    if (pid) {
      // Set State
      //this.history.push('/item/'+pid);
      this.setState({place_id:pid});

    }
  }

findPlacePage(p) {
  this.props.history.push('/item/'+p)

}

  render() {

    return (
      <div>

        <SearchBar id="autocomplete" placeholder="Search for anything...." hintText="Search City" value={this.state.query}
          style={{
            margin: '0 auto',
            maxWidth: 300,
            backgroundColor:'lightgreen'
          }}
        />
        <ListGroup>

          <ListGroup.Item variant="primary">Latest reviews</ListGroup.Item>
          {this.state.recenttopics.slice(0,9).map((list, i) => {
            return <a href={'/item/' + this.state.recenttopics[i].place_id} >
              <ListGroup.Item>Item:{this.state.recenttopics[i].category.name}
              <br></br>Review title:{this.state.recenttopics[i].title}
              <br></br>By:{this.state.recenttopics[i].user.username}
              
              </ListGroup.Item>
            </a>

          })}
        </ListGroup>

        
      </div>
    )
  }
}
export default Home
