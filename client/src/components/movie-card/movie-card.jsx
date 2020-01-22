import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;

    return (
      <Col>
        <Card style={{ width: '16rem' }}>
          <Card.Img variant="top" src={movie.imageurl} />
          <Card.Body>
            <Card.Title className = "movie-title">{movie.title}</Card.Title>
            <Card.Text className = "movie-description">{movie.description}</Card.Text>
            <Button className = "open-button" onClick={() => onClick(movie)} variant="link">Open</Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

MovieCard.propTypes = {
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
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
