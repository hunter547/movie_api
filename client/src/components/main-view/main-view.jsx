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
import { connect } from 'react-redux';
import { setMovies, setUser } from '../../actions/actions';


import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import MoviesList from '../movies-list/movies-list';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';


class MainView extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    let user = localStorage.getItem('user')
    if (accessToken !== null) {
      this.props.setUser(user);
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    this.props.setUser(authData.user.username);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.username);
    this.getMovies(authData.token);
  }

  onLogOut(user) {
    localStorage.clear();
    window.open('/client', '_self');
    this.props.setUser(user);
  }

  getMovies(token) {
    axios.get('https://my-flix-api-evanoff.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  render() {
    let { movies, user } = this.props;
    if (!movies) return <Container className="main-view" fluid="true" />;
    return (
      <Router basename = "/client">
        <Container className="main-view" fluid="true">
          {this.props.user ?
            <Navbar className="navbar navbar-dark">
              <h1 className="myflix-movies">myFlix Spot</h1>
              <Link to={`/users/${localStorage.getItem('user')}`}>
                <Button className="profile-button">Your Profile</Button>
              </Link>
              <a href="/" className="myflix-logout" onClick={user => this.onLogOut(!user)}>Logout</a>
            </Navbar>
            : null
          }
          <Row>
            <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              return <MoviesList movies={movies} />;
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
            <Route path="/users/:username" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              if (movies.length === 0) return <div className="main-view" />;
              return <ProfileView onLogOut={user => this.onLogOut(!user)} />
            }} />
          </Row>
        </Container>
      </Router>
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

export default connect(mapStateToProps, { setMovies, setUser })(MainView);

MainView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }),
    director: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      imageurl: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      birthdate: PropTypes.string.isRequired
    }),
    imageurl: PropTypes.string.isRequired,
    featured: PropTypes.bool.isRequired
  })
),
 user: PropTypes.string.isRequired
};
