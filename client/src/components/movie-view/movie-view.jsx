import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './movie-view.scss';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }


  render() {
    const { movie, mainview } = this.props;
    var featured = '';


    if (!movie) return null;

    if (movie.featured) {
      featured = 'Yes';
    }
    else {
      featured = 'No';
    }

    return (
      <Card className = "movie-card" style={{ width: '32rem' }}>
        <Card.Img variant="top" src={movie.imageurl} />
        <Card.Body>
          <Card.Title className = "movie-title">{movie.title}</Card.Title>
          <Card.Text className = "movie-description">{movie.description}</Card.Text>
          <ListGroup variant ="flush">
            <ListGroup.Item>Genre: {movie.genre.name}</ListGroup.Item>
            <ListGroup.Item>Director: {movie.director.name}</ListGroup.Item>
            <ListGroup.Item>Featured: {featured}</ListGroup.Item>
          </ListGroup>
          <Button className="back-button" onClick={() => mainview(null)}>Back</Button>
        </Card.Body>
      </Card>
    );
  }
}
