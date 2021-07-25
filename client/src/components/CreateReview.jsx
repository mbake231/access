import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/Form'
import { FilterableContent } from 'react-filterable-content'
import ListGroup from 'react-bootstrap/ListGroup'
import StarRatings from 'react-star-ratings';

export default function CreateReview(props) {
  const [keyword, setKeyword] = useState("");
  const [review, setReview] = useState("");
  const [reviewType, setReviewType] = useState("client");
  const [roomRating, setRoomRating] = useState();
  const [foodRating, setFoodRating] = useState();
  const [serviceRating, setServiceRating] = useState();



function handleSubmit(e) {
  e.preventDefault();

}

async function  submitReview() {
    console.log(reviewType)
    var url;
    if (process.env.NODE_ENV === 'production')
      url = process.env.REACT_APP_PROD_URL+'/submitReview';
    else
      url = 'http://localhost:3000/submitReview';
    const response = await axios.post(url, {   
      room_score: roomRating,
      service_score: serviceRating,
      food_score: foodRating,
      review_title: 'my title',
      review_body: review,
      item_id: props.item_id,
      review_type:reviewType,
      cid:props.review_cid
    }, {
      withCredentials: true
    }).catch(error => {
      if (error)
        this.setState({
          showLoginError: true
        })
    })
    if (response) {
      console.log(props.item_cid)
        window.location.reload();
     props.toggleCreateReviewModal();
     
    }

  }



    return (
        <Modal show={props.showCreateReviewModal}> 
            <Modal.Header >
                <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Form.Control as="select" size="lg" onChange={e => setReviewType(e.target.value)}>
                <option value='client'>Client Review</option>
                <option value='advisor'>Advisor Review</option>

            </Form.Control>
              Rooms          <StarRatings
                    rating={roomRating}
                    starRatedColor="blue"
                    changeRating={setRoomRating}
                    starDimension="25px"
                    numberOfStars={5}
                    name='rating'
                    /><br></br>
                Food          <StarRatings
                    rating={foodRating}
                    starRatedColor="blue"
                    changeRating={setFoodRating}
                    starDimension="25px"
                    numberOfStars={5}
                    name='rating'
                    /><br></br>
                    Service          <StarRatings
                    rating={serviceRating}
                    starRatedColor="blue"
                    changeRating={setServiceRating}
                    starDimension="25px"
                    numberOfStars={5}
                    name='rating'
                    />
            

            <Form.Control as="textarea" onChange={e => setReview(e.target.value)} placeholder="Review" />
            
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.toggleCreateReviewModal}>Close</Button>
                <Button variant="primary" onClick={submitReview}>Save review</Button>
            </Modal.Footer>
        </Modal>
        )
    }

