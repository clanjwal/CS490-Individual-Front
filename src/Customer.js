import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './App.css';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // get customers based on the page
  useEffect(() => {
    axios.get(`/displaycustomers?page=${currentPage}&per_page=10`)
      .then(response => {
        setCustomers(response.data.customers);
        setTotalPages(response.data.total_pages);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, [currentPage]);

  const handlePageClick = (data) => {
    let selectedPage = data.selected + 1; 
    setCurrentPage(selectedPage);
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

      <h1 className="text-center">Customers</h1>

      {/* Cutomer list table */}
      <Container className="results-container">
        {customers.length === 0 ? (
          <p className="text-center">No customers found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Pagination (react paginate) */}
      <div className="pagination-controls text-center d-flex justify-content-center mt-4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default Customer;
