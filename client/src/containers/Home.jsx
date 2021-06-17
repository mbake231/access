
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
      recenttopics: { topics: [] },
      generaltopics: { topics: [] },
      divStyle: { width: "1000px", height: "400px", overflow: "hidden", top: "-1000px" },
      forum_url: process.env.REACT_APP_FORUM_URL,
      place_id:null
    }
  };

  componentDidMount() {
    this.handleScriptLoad();
  }

  componentDidUpdate(prevProps) {

    if (prevProps.uid != this.props.uid) {
      this.setState({ uid: this.props.uid },
        () => {
          this.getHomeForumData();
        }

      );
    }

    if(this.state.place_id!==null)
      this.findPlacePage(this.state.place_id);
  }

  async getHomeForumData() {
    console.log('uid:' + this.state.uid)
    var url;
    if (process.env.NODE_ENV === 'production')
      url = 'https://www.thelocalgame.com/login';
    else
      url = 'http://localhost:3000/home';
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
        this.setState({ recenttopics: response.data.recent });
        this.setState({ generaltopics: response.data.general });
        console.log(response.data);

      }
      return response;
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

        <SearchBar id="autocomplete" placeholder="" hintText="Search City" value={this.state.query}
          style={{
            margin: '0 auto',
            maxWidth: 800,
          }}
        />
        <ListGroup>

          <ListGroup.Item variant="primary">General Travel Adivsor Forum</ListGroup.Item>
          {this.state.generaltopics.topics.map((list, i) => {
            return <Link >
              <ListGroup.Item>{this.state.generaltopics.topics[i].title}</ListGroup.Item>
            </Link>
          })}
        </ListGroup>

        <ListGroup>

          <ListGroup.Item variant="primary">General Travel Adivsor Forum</ListGroup.Item>
          {this.state.recenttopics.topics.map((list, i) => {
            return <a href={this.state.forum_url + '/topic/' + this.state.recenttopics.topics[i].slug} >
              <ListGroup.Item>{this.state.recenttopics.topics[i].title}</ListGroup.Item>
            </a>

          })}
        </ListGroup>
      </div>
    )
  }
}
export default Home
