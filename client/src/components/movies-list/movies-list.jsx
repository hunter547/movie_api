import React from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';
import './movies-list.scss';

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.title.toLowerCase().includes(visibilityFilter.toLowerCase()));
  }

  if (!movies) return <div className="main-view" />;

  return <Row className="movies-list">
    <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    {filteredMovies.map(m => <MovieCard key={m._id} movie={m} />)}
  </Row>;
}

export default connect(mapStateToProps)(MoviesList);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  visibilityFilter: PropTypes.string.isRequired
}
