import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import './main-view.scss';


import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';


export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      registration: null
    };
  }

onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.username);
    this.getMovies(authData.token);
  }

  onNeedRegistration(registration){
    this.setState({
      registration
    });
  }

  getMovies(token) {
    axios.get('https://my-flix-api-evanoff.herokuapp.com/movies', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(response => {
      this.setState({
        movies: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const { movies, selectedMovie, user, registration } = this.state;
    if(registration) return <RegistrationView onNeedRegistration={registration => this.onNeedRegistration(registration)}/>;
    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} onNeedRegistration={registration => this.onNeedRegistration(registration)} />;
    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        <Navbar className="navbar navbar-light">
          <h1 className="myflix-movies">myFlix Movies</h1>
          <a href="" className="myflix-logout" onClick={user => this.onLoggedIn(!user)}>Logout</a>
        </Navbar>
        <Container>
          <Row>
            {selectedMovie
              ? <MovieView movie={selectedMovie} mainview={movie => this.onMovieClick(null)} />
              : movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
              ))
            }
          </Row>
        </Container>
      </div>
    );
  }
}

MainView.propTypes = {
  movies: PropTypes.shape({
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
  })
};
