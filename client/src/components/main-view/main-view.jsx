import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './main-view.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';


import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';


export class MainView extends React.Component {
  constructor() {
    super();
    
    this.state = {
      movies: [],
      user: null,
      registration: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
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

  onLogOut(user) {
    localStorage.clear();
    this.setState({
      user
    });
  }

  getMovies(token) {
    axios.get('https://my-flix-api-evanoff.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { movies, user } = this.state;
    if (!movies) return <Container className="main-view" fluid="true" />;
    return (
      <Router>
        <Container className="main-view" fluid="true">
          <Navbar className="navbar navbar-dark">
            <h1 className="myflix-movies">myFlix Spot</h1>
            <Link to ={`/users/${localStorage.getItem('user')}`}>
              <Button className = "profile-button">Profile</Button>
            </Link>
            <a href="" className="myflix-logout" onClick={user => this.onLogOut(!user)}>Logout</a>
          </Navbar>
          <Row>
            <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              return movies.map(m => <MovieCard key={m._id} movie={m} />)
            }} />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route path="/movies/:MovieId" render={({ match }) =>
              <MovieView movie={movies.find(m => m._id === match.params.MovieId)} />} />
            <Route path="/genres/:name" render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.genre.name === match.params.name).genre} />
            }} />
            <Route path="/directors/:name" render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return <DirectorView director={movies.find(m => m.director.name === match.params.name).director} />
            }} />
            <Route path="/users/:username" render = { () => {
              if (movies.length === 0) return <div className="main-view" />;
              return <ProfileView movies={movies}/>
            }} />
          </Row>
        </Container>
      </Router>
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
