import React from 'react';
import axios from 'axios';
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
      user: null
    };
  }

  componentDidMount() {
    axios.get('https://my-flix-api-evanoff.herokuapp.com/movies')
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error)
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  getMainView() {
    return <div className="main-view" />;
  }

  render() {
    const { movies, selectedMovie, user } = this.state;
    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        <Navbar className="navbar navbar-dark">
          <h1 className="myflix-movies">myFlix Movies</h1>
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
