import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Table, Button, Form, Dropdown, FormControl, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('customer_id');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [currentRentals, setCurrentRentals] = useState([]);

  useEffect(() => {
    if (!isSearching) {
      // Fetch paginated customers by default
      axios.get(`/displaycustomers?page=${currentPage}&per_page=10`)
        .then(response => {
          setCustomers(response.data.customers);
          setTotalPages(response.data.total_pages);
        })
        .catch(error => console.error('Error fetching customers:', error));
    }
  }, [currentPage, isSearching]); // Trigger when currentPage or isSearching changes

  const handleSearch = (event) => {
    event.preventDefault();
  
    setIsSearching(true);
  
    axios.get(`/searchcustomers?query=${searchQuery}&category=${searchCategory}`)
      .then(response => {
        setSearchResults(response.data); 
        setCustomers([]); 
        setTotalPages(1);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setSearchResults([]);
        setCustomers([]); 
      });
  };
  
  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchQuery(''); 
    setSearchResults([]); 
    setCustomers([]); 
    setTotalPages(1);
  };

  const handleAddCustomer = () => {
    axios.post('http://localhost:5000/addcustomer', newCustomer)
      .then(response => {
        alert(response.data.success);
        setShowAddForm(false); 
        setNewCustomer({
          first_name: '',
          last_name: '',
          email: ''
        });
      })
      .catch(error => {
        console.error('Error adding customer:', error);
        alert('Error adding customer');
      });
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      axios.put(`http://localhost:5000/updatecustomer/${selectedCustomer.customer_id}`, selectedCustomer)
        .then(response => {
          alert(response.data.success);
          setShowEditForm(false);
          setSelectedCustomer(null);
        })
        .catch(error => {
          console.error('Error updating customer:', error);
          alert('Error updating customer');
        });
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      axios.delete(`http://localhost:5000/deletecustomer/${selectedCustomer.customer_id}`)
        .then(response => {
          alert(response.data.success);
          setShowEditForm(false); 
          setSelectedCustomer(null);
        })
        .catch(error => {
          console.error('Error deleting customer:', error);
          alert('Error deleting customer');
        });
    }
  };

  const handleCloseDetails = () => {
    setShowCustomerDetails(false);
    setCustomerDetails(null);
  };

  const handleViewCustomer = (customerId) => {
    axios.get(`/api/customer/${customerId}`)
      .then((response) => {
        setCustomerDetails(response.data);
        setShowCustomerDetails(true);
        const currentRentalsData = response.data.rentals.filter(rental => rental.return_date === null);
        setCurrentRentals(currentRentalsData);
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
        alert('Error fetching customer details');
      });
  };

  const handleReturnRental = (rentalId, customerId, filmId) => {
    const returnDate = new Date().toISOString(); 
    axios.put(`/api/returnRental/${rentalId}`, {
      rental_id: rentalId,
      customer_id: customerId,
      film_id: filmId,         
      return_date: returnDate 
    })
      .then(response => {
        alert(response.data.success);
        setCurrentRentals(prevState => prevState.filter(rental => rental.rental_id !== rentalId));
      })
      .catch(error => {
        console.error('Error returning rental:', error);
        alert('Error returning rental');
      });
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedCustomer) {
      setSelectedCustomer(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setNewCustomer(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const pageNumbers = () => {
    const range = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage === 1) {
        range.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        range.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return range;
  };

  return (
    <div className="App bg-light">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Sakila</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/films">Films</Nav.Link>
              <Nav.Link as={Link} to="/customer">Customer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <h1 className="text-center">Customers</h1>

      {/* Search Bar with Dropdown */}
      <Container className="search-container d-flex justify-content-center">
        <div className="d-flex align-items-center">
          <Dropdown onSelect={(eventKey) => setSearchCategory(eventKey)}>
            <Dropdown.Toggle variant="secondary">
              {searchCategory === "customer_id" ? "Customer ID" : searchCategory === "first_name" ? "First Name" : "Last Name"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="customer_id">Customer ID</Dropdown.Item>
              <Dropdown.Item eventKey="first_name">First Name</Dropdown.Item>
              <Dropdown.Item eventKey="last_name">Last Name</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form className="d-flex ms-2" onSubmit={handleSearch}>
            <FormControl
              type="text"
              placeholder="Search a Customer"
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e); 
                }
              }}
            />
            <Button variant="primary" type="submit">Search</Button>
            <Button variant="secondary" onClick={handleClearSearch} className="ms-2">Clear</Button>
          </Form>
        </div>
      </Container>

      <Container className="results-container">
      {isSearching ? (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Customer ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Edit</th>
        <th>View</th>
      </tr>
    </thead>
    <tbody>
      {searchResults.length > 0 ? (
        searchResults.map((customer) => (
          <tr key={customer.customer_id}>
            <td>{customer.customer_id}</td>
            <td>{customer.first_name}</td>
            <td>{customer.last_name}</td>
            <td>
              <Button variant="outline-dark" onClick={() => { setSelectedCustomer(customer); setShowEditForm(true); }}>Edit</Button>
            </td>
            <td>
              <Button variant="outline-info" onClick={() => handleViewCustomer(customer.customer_id)} className="ms-2">
                View
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center">No customers found.</td>
        </tr>
      )}
    </tbody>
  </Table>
) : (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Customer ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Edit</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {customers.length > 0 ? (
        customers.map((customer) => (
          <tr key={customer.customer_id}>
            <td>{customer.customer_id}</td>
            <td>{customer.first_name}</td>
            <td>{customer.last_name}</td>
            <td><Button variant="outline-dark" onClick={() => { setSelectedCustomer(customer); setShowEditForm(true); }}>Edit</Button></td>
            <td><Button variant="outline-info" onClick={() => handleViewCustomer(customer.customer_id)} className="ms-2">View</Button></td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center">No customers found.</td>
        </tr>
      )}
    </tbody>
  </Table>
)}
      </Container>

      {/* Add New Customer Button */}
      <Container className="d-flex justify-content-center my-3">
        <Button variant="success" onClick={() => setShowAddForm(true)}>
          Add Customer
        </Button>
      </Container>

      {/* Add Customer Form Modal */}
      <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="first_name"
                value={newCustomer.first_name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLastName" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="last_name"
                value={newCustomer.last_name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddForm(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCustomer}>
            Add Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Customer Form Modal */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="first_name"
                value={selectedCustomer ? selectedCustomer.first_name : ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLastName" className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="last_name"
                value={selectedCustomer ? selectedCustomer.last_name : ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={selectedCustomer ? selectedCustomer.email : ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditForm(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditCustomer}>
            Save Changes
          </Button>
          <Button variant="danger" onClick={handleDeleteCustomer}>
            Delete Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Customer Details Modal */}
      <Modal show={showCustomerDetails} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {customerDetails ? (
            <div>
              <h5>Customer Info</h5>
              <p><strong>First Name:</strong> {customerDetails.first_name}</p>
              <p><strong>Last Name:</strong> {customerDetails.last_name}</p>
              <p><strong>Email:</strong> {customerDetails.email}</p>
              <p><strong>Member Since:</strong> {new Date(customerDetails.create_date).toLocaleDateString()}</p>
              
              {/* Current Rentals Table */}
              <h5 className="mt-4">Current Rentals</h5>
              {currentRentals.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Rental ID</th>
                      <th>Film Title</th>
                      <th>Return Movie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRentals.map((rental) => (
                      <tr key={rental.rental_id}>
                        <td>{rental.rental_id}</td>
                        <td>{rental.title}</td>
                        <td>
                          <Button variant="outline-info" onClick={() => handleReturnRental(rental.rental_id, customerDetails.customer_id, rental.film_id)}>
                            Return
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No current rentals.</p>
              )}

              <h5 className="mt-4">Rental History</h5>
              {customerDetails.rentals && customerDetails.rentals.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Rental ID</th>
                      <th>Film Title</th>
                      <th>Return Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDetails.rentals.map((rental, index) => (
                      <tr key={rental.rental_id}>
                        <td>{rental.rental_id}</td>
                        <td>{rental.title}</td>
                        <td>{new Date(rental.return_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No rental history available.</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination Controls */}
      {!isSearching && customers.length > 0 && (
        <div className="pagination-controls text-center mt-4">
          <Button 
            variant="dark" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(1)}
            className="mx-2"
          >
            First
          </Button>
          <Button 
            variant="dark" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
            className="mx-2"
          >
            Previous
          </Button>
          {pageNumbers().map((pageNum) => (
            <Button 
              key={pageNum}
              variant={currentPage === pageNum ? "primary" : "light"}
              onClick={() => setCurrentPage(pageNum)}
              className="mx-1"
            >
              {pageNum}
            </Button>
          ))}
          <Button 
            variant="dark" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
            className="mx-2"
          >
            Next
          </Button>
          <Button 
            variant="dark" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
            className="mx-2"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
}

export default Customer;
