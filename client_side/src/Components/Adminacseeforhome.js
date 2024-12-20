import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { getAdminPostbyStatus } from "../helper/Helper";
import { Link } from "react-router-dom";
import Loader from './Loader';
import './FontText.css';

const Adminacseeforhome = () => {
  const [latestAdminPosts, setLatestAdminPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestAdminPosts(); 
  }, []);

  const fetchLatestAdminPosts = async () => {
    try {
      const response = await getAdminPostbyStatus();
      const sortedResponse = response.sort((a, b) => b.Ticket_no - a.Ticket_no);
      const latestFivePosts = sortedResponse.slice(0, 5); // Get the latest 5 records
      setLatestAdminPosts(latestFivePosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching latest admin posts:", error);
    }
  };

  if (isLoading) {
    return <Loader />; 
  }

  return (
    <Container fluid> 
      <Row className="mt-2">
        <Col md={12} style={{ marginLeft: '30px' }}>  
          {latestAdminPosts.length > 0 ? (
          <Row className="mt-2">
            <Col md={12} style={{ marginLeft: '30px' }}>
            <h2 className="header-title ml-5">Current Client Requirements</h2>
            <Table className="custom-font table-responsive-lg"  bordered
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 12px",
                    tableLayout: "auto",
                    width: "120%",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px #ccc",
                    marginBottom: "20px",
                    marginTop: "20px",
                    color: "#000",
                  }}>
                <thead className="pt-5"> 
                <tr>
                  <th>Date</th>                
                    <th>Req.No</th>
                    <th>Client</th>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Status</th>                                    
                    <th>Details</th>
                    <th>Resumes</th>                                     
                  </tr>
                </thead>
                <tbody>
                  {latestAdminPosts.map((user) => (
                     <tr key={user._id}>
                     <td>{new Date(user.date).toLocaleDateString("en-GB")}</td>                  
                     <td>{user.Ticket_no}</td>
                     <td>{user.Client_Name}</td>
                     <td>{user.Tech_stack.map(tech => tech.value).join(', ')}</td>
                     <td>{user.Location.map(Location => Location.value).join(', ')}</td>
                     <td>{user.status}</td>                 
                     <td>
                     <Link to={`/viewadminpost/${user._id}`}>
                           <Button variant="outline-dark" size="md">View</Button>
                         </Link>
                     </td>  
                     <td>
                      
                      <Link to={`/recutepost/${user._id}`}>
                            <Button variant="outline-dark" size="md">Upload</Button>
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
              <p className="custom-text">No results found.</p>
            </Col>
          </Row>
        )}
        </Col>
      </Row>
    </Container>
  );
};

export default Adminacseeforhome;