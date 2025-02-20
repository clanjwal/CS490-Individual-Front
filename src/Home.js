// react
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// files
import './App.css';

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);

  // Get top 5 rented movies
  useEffect(() => {
    axios.get('/top5movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  // Get top 5 actors
  useEffect(() => {
    axios.get('/top5actors')
      .then(response => setActors(response.data))
      .catch(error => console.error('Error fetching actors:', error));
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie === selectedMovie ? null : movie);
  };

  const handleActorClick = (actor) => {
    if (selectedActor === actor) {
      setSelectedActor(null);
      setActorMovies([]); // clear
    } else {
      setSelectedActor(actor);
      // get top 5 movies for this actor
      axios.get(`/top5actors_movies?actor_id=${actor[0]}`)
        .then(response => setActorMovies(response.data))
        .catch(error => console.error('Error fetching actor movies:', error));
    }
  };

  return (
    <div className="App bg-light">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand">Sakila</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto navbar-nav">
              <Nav.Link as = {Link} to="/films">Films</Nav.Link>
              <Nav.Link as = {Link} to="/customer">Customer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Top 5 Movies */}
      <h1 className="text-center">Top 5 Rented Movies</h1>
      <div className="films-list">
        {movies.map((film) => (
            <div className="film-item" key={film.film_id}>
              <div className="film-image" onClick={() => handleMovieClick(film)}>
                <img src={`./movie_icon.jpg`} alt="Film" style={{ width: 100, height: 100, cursor: 'pointer' }} />
                <h4>{film[1]}</h4>
              </div>

              {/* Movie Details Formatting*/}
              {selectedMovie === film && (
                <div className="film-details">
                  <p><strong>Rental Count:</strong> {film[2]}</p>
                  <p><strong>Description:</strong> {film[3]}</p>
                  <p><strong>Release Year:</strong> {film[4]}</p>
                  <p><strong>Rental Rate:</strong> ${film[5]}</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Actors */}
      <h1 className="text-center">Top 5 Actors</h1>
      <div className="films-list">
        {actors.map((actor) => (
            <div className="film-item" key={actor.actor_id}>
              <div className="film-image" onClick={() => handleActorClick(actor)}>
                <img src={`./actor_icon.jpg`} alt="Actor" style={{ width: 100, height: 100, cursor: 'pointer' }} />
                <h4>{actor[1]} {actor[2]}</h4>
              </div>

              {/* Actor Details */}
              {selectedActor === actor && (
                <div className="actor-details">
                <p><strong>Top 5 Movies Appeared In:</strong></p>
                  <ul>
                    {actorMovies.map((movie) => (
                      <li key={movie[0]}>{movie[1]} (Rented {movie[2]} times)</li>
                    ))}
                  </ul>
              </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
