import React, { useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Form, FormControl, Button, Dropdown, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

function Films() {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [searched, setSearched] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() === "") {
      setFilms([]);
      setSearched(true); // Show "No results" if searching empty
      return;
    }

    axios.get(`http://127.0.0.1:5000/searchfilms?query=${searchQuery}&category=${searchCategory}`)
      .then(response => {
        setFilms(response.data);
        setSearched(true);
      })
      .catch(error => {
        console.error('Error searching films:', error);
        setSearched(true);
      });
  };

  const handleCardClick = (film) => {
    setSelectedFilm(selectedFilm === film ? null : film);
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

      <h1 className="text-center">Search for a Film</h1>

      {/* Search Bar */}
      <Container className="search-container">
          <Dropdown onSelect={(eventKey) => setSearchCategory(eventKey)}>
            <Dropdown.Toggle variant="secondary">
              {searchCategory === "title" ? "Film Title" : searchCategory === "actor" ? "Actor Name" : "Film Genre"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="title">Film Title</Dropdown.Item>
              <Dropdown.Item eventKey="actor">Actor Name</Dropdown.Item>
              <Dropdown.Item eventKey="genre">Film Genre</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form className="d-flex" onSubmit={handleSearch}>
          <FormControl
            type="text"
            placeholder="Search a Film"
            className="me-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" type="submit" className="ms-2">Search</Button>
        </Form>
      </Container>

      {/* Search Results */}
      <Container className="results-container">
        {searched && films.length === 0 ? (
          <p className="text-center">No films found.</p> 
        ) : (
          films.map((film, index) => (
            <Card key={index} className="film-card" onClick={() => handleCardClick(film)}>
              <Card.Body>
                <Card.Title className="card-title">{film.title}</Card.Title>
                <Card.Text className="genre-text"><strong>Genre(s):</strong> {film.genre}</Card.Text>
                {searchCategory === "actor" && (
                  <Card.Text className="actor-text"><strong>Actor:</strong> {film.actor_name}</Card.Text>
                )}
                {/* Additional details on click */}
                {selectedFilm === film && (
                  <div className="film-details">
                    <Card.Text><strong>Release Year:</strong> {film.release_year}</Card.Text>
                    <Card.Text><strong>Rental Rate:</strong> ${film.rental_rate}</Card.Text>
                    <Card.Text><strong>Description:</strong> {film.description}</Card.Text>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
}

export default Films;