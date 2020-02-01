import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './movie-view.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  addToFavorites(e, movie) {
    e.preventDefault();
    let username = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    axios({method: 'post',
      url: `https://my-flix-api-evanoff.herokuapp.com/users/${username}/Movies/${movie._id}`,
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      alert(`${movie.title} was added to your favorites`);
    })
    .catch(function(error) {
      console.log(error);
    });
  }


  render() {
    const { movie } = this.props;
    var featured = '';

    if (!movie) return null;

    if (movie.featured) {
      featured = 'Yes';
    }
    else {
      featured = 'No';
    }

    return (
      <Card className = "movie-view" style={{ width: '32rem' }}>
        <Card.Img variant="top" src={movie.imageurl} />
        <Card.Body>
          <Card.Title className = "movie-title">{movie.title}</Card.Title>
          <Card.Text className = "movie-description">{movie.description}</Card.Text>
          <ListGroup variant ="flush">
            <ListGroup.Item>Genre: {movie.genre.name}</ListGroup.Item>
            <ListGroup.Item>Director: {movie.director.name}</ListGroup.Item>
            <ListGroup.Item>Featured: {featured}</ListGroup.Item>
            <ListGroup.Item>
              <Button className = "back-button" onClick={(e) => this.addToFavorites(e, movie)}>Add to Favorites</Button>
            </ListGroup.Item>
          </ListGroup>
          <Link to = {`/`}>
            <Button className="back-button">Back</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    director: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    imageurl: PropTypes.string.isRequired,
    featured: PropTypes.bool.isRequired
  }).isRequired
};
