import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import './movie-card.scss';
import { Link } from 'react-router-dom';

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;
    return (
      <Col className="card-columns" style={{ maxWidth: '18rem', minWidth: '18rem' }}>
        <Card className="movie-card" style={{ maxWidth: '16rem', minWidth: '16rem' }}>
          <Card.Img variant="top" src={movie.imageurl} />
          <Card.Body>
            <Card.Title className="movie-title">{movie.title}</Card.Title>
            <Card.Text className="movie-description">{movie.description}</Card.Text>
            <ListGroup className="card-links" variant="flush">
              <ListGroup.Item>
                <Link to={`/movies/${movie._id}`}>
                  <Button className="open-button" variant="link">More Info</Button>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to={`/directors/${movie.director.name}`}>
                  <Button className="open-button" variant="link">Director</Button>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to={`/genres/${movie.genre.name}`}>
                  <Button className="open-button" variant="link">Genre</Button>
                </Link>
              </ListGroup.Item>
            </ListGroup>
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
  }).isRequired
};
