import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/Form'
import { FilterableContent } from 'react-filterable-content'
import ListGroup from 'react-bootstrap/ListGroup'

export default function AddItem(props) {
  const [keyword, setKeyword] = useState("");
  const [password, setPassword] = useState("");


function handleSubmit(e) {
  e.preventDefault();

}




    return (
        <Modal show={false}> 
            <Modal.Header closeButton>
                <Modal.Title>Add task</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Form.Control as="select" size="lg">
                <option>All</option>
                <option>Eating and Diet</option>
                <option>Track body stats</option>
                <option>Positive thinking</option>

            </Form.Control>
            <Form.Control onChange={e => setKeyword(e.target.value)} placeholder="Search" />
            <FilterableContent 
                keyword={keyword}
          
                >
                            <ListGroup>
                            <ListGroup.Item>Meditation</ListGroup.Item>
                            <ListGroup.Item>Fart loudly</ListGroup.Item>
                            <ListGroup.Item >Weight yourself</ListGroup.Item>
                            <ListGroup.Item>Drink water</ListGroup.Item>
                            <ListGroup.Item>Think on stuff</ListGroup.Item>
                            </ListGroup>
            </FilterableContent>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
        )
    }

