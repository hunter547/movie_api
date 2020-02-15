import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './movie-view.scss';
import { setFavorite } from '../../actions/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

const mapStateToProps = state => {
  const { favorite } = state;
  return { favorite };
};

function MovieView(props) {
  const { movie, favorite } = props;

  (function () {
    axios.get(`https://my-flix-api-evanoff.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${props.movie._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        props.setFavorite(response.data);
      })
      .catch(function(error) {
        console.log(error);
    });

  })();

  const addToFavorites = (e) => {
    e.preventDefault();
    let username = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    axios({
      method: 'post',
      url: `https://my-flix-api-evanoff.herokuapp.com/users/${username}/Movies/${props.movie._id}`,
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        props.setFavorite(true);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
    var featured = '';

    if (!props.movie) return null;

    if (props.movie.featured) {
      featured = 'Yes';
    }
    else {
      featured = 'No';

    return (
      <Card className="movie-view" style={{ width: '32rem' }}>
        <Card.Img variant="top" src={props.movie.imageurl} />
        <Card.Body>
          <Card.Title className="movie-title">{props.movie.title}</Card.Title>
          <Card.Text className="movie-description">{props.movie.description}</Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>Genre: {props.movie.genre.name}</ListGroup.Item>
            <ListGroup.Item>Director: {props.movie.director.name}</ListGroup.Item>
            <ListGroup.Item>Featured: {featured}</ListGroup.Item>
            {favorite ?
              <ListGroup.Item>
                <Button className="disabled-button" variant="secondary" disabled>Favorited</Button>
              </ListGroup.Item>
              :
              <ListGroup.Item>
                <Button className="back-button" onClick={addToFavorites}>Add to Favorites</Button>
              </ListGroup.Item>
            }
          </ListGroup>
          <Link to={`/`}>
            <Button className="back-button">Back</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

export default connect(mapStateToProps, { setFavorite })(MovieView);

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
