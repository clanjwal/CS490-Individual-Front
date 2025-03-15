import React, { useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Form, FormControl, Button, Dropdown, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

function Films() {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [searched, setSearched] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      setFilms([]);
      setSearched(true);
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
    setSelectedFilm(film);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFilm(null);
  };

  const handleRentFilm = () => {
    if (!customerId.trim()) {
      alert("Please enter a valid Customer ID.");
      return;
    }

    const parsedCustomerId = parseInt(customerId, 10);
    if (isNaN(parsedCustomerId)) {
      alert("Invalid Customer ID. Please enter a number.");
      return;
    }

    axios.post("http://127.0.0.1:5000/rentfilm", {
      film_id: selectedFilm?.film_id,
      customer_id: parsedCustomerId,
      store_id: selectedFilm?.store_id, 
    })
      .then(response => {
        alert(response.data.success); 
        setShowModal(false); 
        setCustomerId("");
      })
      .catch(error => {
        alert(error.response?.data?.error || "An error occurred while renting the film.");
      });
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
              <Nav.Link as={Link} to="/films">Films</Nav.Link>
              <Nav.Link as={Link} to="/customer">Customer</Nav.Link>
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
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      {/* Modal for Film Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedFilm?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p><strong>Release Year:</strong> {selectedFilm?.release_year}</p>
            <p><strong>Rental Rate:</strong> ${selectedFilm?.rental_rate}</p>
            <p><strong>Description:</strong> {selectedFilm?.description}</p>

            <div className="mt-3">
              <label>Customer ID</label>
              <input
                type="text"
                placeholder="Enter Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            {/* Rent Button */}
            <Button
              variant="success"
              className="mt-3"
              onClick={handleRentFilm}
            >
              Rent
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Films;
