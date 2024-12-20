import React, { useState, useEffect } from "react";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { getArohaRecruitments } from "../helper/Helper";
import Loader from './Loader';
import './FontText.css';
import { Link } from "react-router-dom";

const Arohabench = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all user details on component mount
  useEffect(() => {
    fetchAllUserDetails();
  }, []);

  const fetchAllUserDetails = async () => {
    try {
      const response = await getArohaRecruitments();
      setSearchResult(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all user details:", error);
    }
  };

  const downloadResume = (resumeUrl) => {
    if (resumeUrl !== 'N/A') {
      var link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'resume.pdf'; // You can set the desired file name here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Resume not available for download.');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-5 custom-font">
      <Container fluid>
        <Row>
          <Col md={12} className="d-flex justify-content-start">
            <Button as={Link} to="/benchresourcepost" className="btn btn-primary mt-3">
              Add Resource
            </Button>
          </Col>
        </Row>
        {searchResult.length > 0 ? (
          <Row>
            <Col md={12} style={{ marginLeft: '10px' }}>
              <h3 className="custom-font pt-5">Aroha Technologies Bench Candidates</h3>
              <Table
                className="custom-font table-responsive-lg"
                bordered
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 12px",
                  tableLayout: "auto",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px #ccc",
                  marginBottom: "20px",
                  padding: "10px",
                  marginTop: "15px",
                  marginLeft: "15px",
                  marginRight: "20px",
                  color: "#000",
                }}
              >
                <thead>
                  <tr>
                    <th>Req.No</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Domain</th>
                    <th>YOE</th>
                    <th>Availability</th>
                    <th>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{user.Ticket_no}</td>
                      <td>{user.CandidateName}</td>
                      <td>{user.MobileNumber}</td>
                      <td>{user.Email}</td>
                      <td>{user.Domain.map(tech => tech.value).join(', ')}</td>
                      <td>{user.Yre_of_expe.map(tech => tech.value).join(', ')}</td>
                      <td>{user.Availability}</td>
                      <td>
                        <Button
                          onClick={() => downloadResume(user?.Upload_resume || "N/A")}
                          className="btn btn-success"
                        >
                          Download
                        </Button>
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
              <p>No candidates available.</p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Arohabench;