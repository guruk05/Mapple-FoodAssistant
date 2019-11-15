import React from 'react';
import { Card , Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Info = () => (
    	<Card style={{ width: '20rem' , height: "31rem"}}>
  <Card.Img  style={{ width: '20rem'}} variant="top" src="https://medcitynews.com/wp-content/uploads/2017/11/GettyImages-840949292-600x450.jpg"/>
  <Card.Body>
    <Card.Title>Food Assistance</Card.Title>
    <Card.Text >
      Hi, I am Mapple .
      <br></br>
      U can ask me about Foods and Restaurants
      <br></br>
      I am here to help you.
    </Card.Text>
    <Card.Text>
      To know how i am built 
    </Card.Text>
    <Button className = "button" variant="secondary"><a className = "apply" href = "https://github.com/guruk05/Mapple-FoodAssistant">Click here</a></Button>
  </Card.Body>
</Card>
);


