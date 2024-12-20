import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col, Form,Pagination} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getClients } from '../helper/Helper'; // Adjust the path as necessary
import Loader from './Loader';

const Getclientdetails = () => {
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const postsPerPage = 10; // Number of results to display per page

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await getClients(); // Fetch all clients initially
        setFilteredClients(response.clients); // Initialize with all clients
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchClientDetails();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = async () => {
    try {
      if (search.trim() === '') {
        // Fetch all clients if the search field is empty
        const response = await getClients();
        setFilteredClients(response.clients);
      } else {
        // Fetch clients based on the search query
        const response = await getClients(search);
        setFilteredClients(response.clients);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  // Automatically show all clients if search field is cleared
  useEffect(() => {
    if (search.trim() === '') {
      const fetchAllClients = async () => {
        try {
          const response = await getClients();
          setFilteredClients(response.clients);
        } catch (error) {
          console.error('Error fetching client details:', error);
        }
      };

      fetchAllClients();
    }
  }, [search]);

  // Pagination
  const indexOfLastClient = currentPage * postsPerPage;
  const indexOfFirstClient = indexOfLastClient - postsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = Array.from({ length: Math.ceil(filteredClients.length / postsPerPage) }, (_, i) => i + 1);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-5 custom-font">
      <Container fluid>
        <Row className="mb-3">
          <Col md={12} style={{ marginLeft: '30px' }}>
            <Button as={Link} to="/clientinfo" className="btn btn-primary mt-3">
              Add Client
            </Button>

            <Form onSubmit={(e) => { e.preventDefault(); handleSearchClick(); }}>
              <Form.Group>
                <Form.Label><h6>Search by Client Name</h6></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter client name"
                  value={search}
                  onChange={handleSearchChange}
                  style={{ maxWidth: '200px' }}
                />
              </Form.Group>
              <Button
                onClick={handleSearchClick}
                className="btn btn-secondary mb-4 mt-2"
                style={{ maxWidth: '200px' }}
              >
                Search
              </Button>
            </Form>

            <h3 className="custom-font pt-5">Aroha Technologies Clients</h3>
            <Table
              className="custom-font table-responsive-lg"
              bordered
              style={{
                borderCollapse: 'separate',
                borderSpacing: '0 12px',
                tableLayout: 'auto',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 0 10px #ccc',
                marginBottom: '20px',
                padding: '10px',
                marginTop: '20px',
                marginLeft: '20px',
                marginRight: '20px',
                color: '#000',
              }}
            >
              <thead style={{ backgroundColor: '#ffc0cb' }}>
                <tr>
                  <th>Req id</th>
                  <th>Clientname</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>MobileNumber</th>
                  <th>HrEmail</th>
                  <th>HrMobileNumber</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.length > 0 ? (
                  currentClients.map((client, index) => (
                    <tr key={index}>
                      <td>{client.Req_id}</td>
                      <td>{client.Clientname}</td>
                      <td>{client.Address}</td>
                      <td>{client.Email}</td>
                      <td>{client.MobileNumber}</td>
                      <td>{client.HrEmail}</td>
                      <td>{client.HrMobileNumber}</td>
                      <td>
                        <Button as={Link} to={`/updateclientdetail/${client._id}`} className="btn btn-success">
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No clients found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Pagination style={{ marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
              {pageNumbers.map((number) => {
                if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
                  return (
                    <Pagination.Item
                      key={number}
                      active={number === currentPage}
                      onClick={() => paginate(number)}
                      style={{
                        border: '1px solid #007bff',
                        margin: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      {number}
                    </Pagination.Item>
                  );
                } else if (Math.abs(number - currentPage) === 3) {
                  return <Pagination.Ellipsis key={number + 'ellipsis'} disabled />;
                }
                return null;
              })}
            </Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Getclientdetails;