import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AddItem from '../components/AddItem.jsx';
import qs from 'qs';
import axios from 'axios';
import list_stub from './list_stub.json';
import DatePicker from 'react-date-picker';

class ListView extends Component{
  constructor() {
  super();
  this.state = {
    list_id:null,
    item_list: list_stub,
    editMode: false,
    date_value:new Date()
  }
  this.handleDateChange=this.handleDateChange.bind(this);
  };


  componentDidMount() {
    this.setState({list_id:qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).list_id}, () => {
        this.getList();
    }
    
    );
}


getList (data, callback){
  
    var url;
      if(process.env.NODE_ENV === 'production')
        url='https://www.thelocalgame.com/register';
      else
        url='http://localhost:3000/api/my_list';
    
    axios.post(url,{list_id:this.state.list_id,date:this.state.date_value},{withCredentials: true, credentials: 'include'}).then(response =>{
      //callback(response.data);
      console.log(response.data);
      this.setState({item_list:response.data});
    }).catch(err =>{
      console.log(err);
    })
  }

handleDateChange(date) {
    this.setState({date_value:date}, () => {
        this.getList();
    });

}

 render(){
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">MindfullList</Navbar.Brand>
                <Button variant="outline-success">Edit</Button>
            </Navbar>
            <AddItem />
            <DatePicker
            onChange={this.handleDateChange}
            value={this.state.date_value}
            />
            <ListGroup>
            <ReactSortable
                list={this.state.item_list.items}
                setList={(newState) => this.setState({ list: newState })}
                disabled={!this.state.editMode}
            >
                {this.state.item_list.items.map((item) => (
                <ListGroup.Item >{item.item_name}<br/>{item.item_desc}<br/>{item.item_value}</ListGroup.Item>
                ))}
            </ReactSortable>
            </ListGroup>
        </div>
        )
    }
}
export default ListView 
