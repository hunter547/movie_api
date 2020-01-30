import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './director-view.scss';
import { Link } from 'react-router-dom';

export class DirectorView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }


  render() {
    const { director } = this.props;


    if (!director) return null;

    let birthday = new Date(director.birthdate);
    let yearsOld = calculateAge(birthday);

    function calculateAge(birthday) {
      var ageDifMs = Date.now() - birthday;
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return (
      <Card className = "director-view" style={{ width: '32rem' }}>
        <Card.Img variant="top" src={director.imageurl} />
        <Card.Body>
          <Card.Title className = "director-name">{director.name}</Card.Title>
          <Card.Text className = "director-bio">{director.bio}</Card.Text>
          <ListGroup variant ="flush">
            <ListGroup.Item>Birthday: {birthday.toDateString()} ({yearsOld} years old)</ListGroup.Item>
          </ListGroup>
          <Link to = {`/`}>
            <Button className="back-button">Back</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageurl: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired
  }).isRequired
};
