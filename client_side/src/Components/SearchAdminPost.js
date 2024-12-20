import React, { useState, useEffect } from "react";
import { Formik, Form, Field} from "formik";
import { Button, Table, Container, Row, Col, Card,Pagination } from "react-bootstrap";
import { getAdminPostClientRequirement, getAllAdminePostClientDetails } from "../helper/Helper";
import { CSVLink } from 'react-csv';
import { Link } from "react-router-dom";
import Loader from './Loader';
import './FontText.css';

const SearchForm = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [csvData, setCsvData] = useState([]);
  const resultsPerPage = 10; // Number of results to display per page
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllAdminPostDetails();
  }, []);

  const fetchAllAdminPostDetails = async () => {
    try {
      const response = await getAllAdminePostClientDetails();
      setSearchResult(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching admin post details:", error);
    }
  };

  useEffect(() => {
    generateCsvData(searchResult);
  }, [searchResult]);
  
  const generateCsvData = (data) => {
    const csvDataArray = data.map((user) => [
      user.date,
      user.Ticket_no,
      user.Client_Name,
      user.Tech_stack.map(tech => tech.value).join(', '),
      user.Location.map(tech => tech.value),
      user.status
      
    ]);
  
    if (csvDataArray.length > 0) {
      const headers = [
        'Date',
        'Req.No',
        'Client Name',
        'Tech Stack',
        'Location',
        'Status'
        // <td>{new Date(user.date).toLocaleDateString("en-GB")}</td>
        // <td>{user.Ticket_no}</td>
        // <td>{user.Client_Name}</td>
        // <td>{user.Tech_stack.map(tech => tech.value).join(', ')}</td>
        // <td>{user.Location.map(tech => tech.value)}</td>
        // <td>{user.status}</td>
      ];
  
      setCsvData([headers, ...csvDataArray]);
    } else {
      setCsvData([]); // Make sure to set csvData to an empty array if there's no data
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await getAdminPostClientRequirement(values);
      setSearchResult(response);
      setCurrentPage(1);
      generateCsvData(response);
    } catch (error) {
      console.error("Error fetching admin post details:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const sortedSearchResult = Array.isArray(searchResult)
    ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
    : [];

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const resultsToDisplay = sortedSearchResult.slice(indexOfFirstResult, indexOfLastResult);

 

  const pageNumbers=Array.from({length:Math.ceil(sortedSearchResult.length/resultsPerPage)},(_,i)=>i+1);

  const handlePageChange=(page)=>{
    setCurrentPage(page);
  }
  
  if (isLoading) {
    return (
     <Loader/>
    );
  }
  


  const initialValues = {
    Ticket_no: "",
    Client_Name: "",
    status: "",
    fromDate: "",
    toDate: "",
  };

  return (
    <div className="pt-5 custom-font"> 
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <Container fluid className="pt-5">
          <Card style={{ marginLeft: "150px" }} className="mt-2 pt-2">
            <Row>
              <Col sm={12} md={12} className="text-center pt-5">
                <Card.Header> 
                <h2 className="header-title text-center" style={{ textDecoration: 'underline' }}>Search Client Details</h2>
                </Card.Header>
                <Card.Body>
                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    <Form>
                      <Row>
                        <Col md={4}>
                          <Field
                            type="text"
                            placeholder="Enter Client Name"
                            name="Client_Name"
                            className="form-control"
                          />
                         
                        </Col>
                        <Col md={4}>
                          <Field
                            type="number"
                            placeholder="Enter Req.No"
                            name="Ticket_no"
                            className="form-control"
                          />
                        
                        </Col>
                        <Col md={4}>
                          <Field
                            component="select"
                            name="status"
                            className="form-control">
                            <option value="">status</option>
                            <option value="Open">Open</option>
                            <option value="Interview">Interview</option>
                            <option value="Sourcing">Sourcing</option>
                            <option value="Customer">Customer</option>
                            <option value="Closed">Closed</option>
                          </Field>
                        
                        </Col>
                      </Row>
                      <br/>
                      <Row className="pt-3">
                         <Col md={2}>
                     
                       <label>From Date</label>
                    
                   
                  </Col>
                  <Col md={4}>
                                    
                      <Field type="date" name="fromDate" className="form-control" />
                  
                  </Col>
                  <Col md={2}>
               
                  <label>To Date</label>
                   
                  </Col>
                  <Col md={4}>
              
                      <Field type="date" name="toDate" className="form-control" />
                    
                  </Col>
                      </Row>
                      <Button className="mt-5" variant="outline-info" type="submit" disabled={loading}>
                        {loading ? 'searching...' : 'Search'}
                        </Button>
                    </Form>
                  </Formik>
                </Card.Body>
              </Col>
            </Row>
          </Card>

      
          {resultsToDisplay.length > 0 ? (
            <Row className="mt-5">
              <Col md={12} style={{ marginLeft: "50px" }}>
              <h3 className="text-center pt-5"  style={{ textDecoration: "underline" }}>Client Details</h3>
              <CSVLink data={csvData} filename={'candidate_details.csv'}>
        <Button className="mt-5 mr-2" variant="outline-success">
          Export to CSV
        </Button>
      </CSVLink>
                <Table striped hover>
                  <thead>
                    <tr>
                    <th>Date</th>
                      <th>Req.No</th>
                      <th>Client Name</th>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsToDisplay.map((user) => (
                      <tr key={user._id}>
                        <td>{new Date(user.date).toLocaleDateString("en-GB")}</td>
                        <td>{user.Ticket_no}</td>
                        <td>{user.Client_Name}</td>
                        <td>{user.Tech_stack.map(tech => tech.value).join(', ')}</td>
                        <td>{user.Location.map(tech => tech.value).join(', ')}</td>
                        <td>{user.status}</td>
                        
                        <td>
                          <Link to={`/updateadminpost/${user._id}`}>
                            <Button variant="outline-success">Update</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={12}>
                <p>No results found.</p>
              </Col>
            </Row>
          )}
            {/* Display pagination */}
            <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
              {pageNumbers.map((number) => {
                if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
                  return (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => handlePageChange(number)}
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
        </Container>
      </div>
    </div>
  );
};

export default SearchForm;