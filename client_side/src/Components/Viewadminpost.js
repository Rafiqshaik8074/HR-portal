import React, { useState, useEffect } from 'react';
import { getAdmindetailsById } from '../helper/Helper';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import { Container, Table,Button} from 'react-bootstrap';
import './Viewadminpost.css'; 
import {downloadResume} from '../helper/Convert'
import {viewResumeInPDF} from '../helper/Convert'

const Viewadminpost = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null); // Initialize userData as null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => { 
      try {
        const response = await getAdmindetailsById(userId);
        setUserData(response);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching user details:", error);
        setIsLoading(false); // Handle the error by setting isLoading to false
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <Container className="pt-5 ml-5"> 
      {isLoading ? (
        <Loader />
      ) : userData ? ( // Check if userData is not null
      <Table striped bordered hover responsive className="custom-table">
      <thead>
        <tr>
          <th colSpan="2" className="custom-header">
            Client Requirement Details
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="custom-label">Requirement Number</td>
          <td>{userData.Ticket_no}</td>
        </tr>
        <tr>
          <td className="custom-label">Client Name</td>
          <td><i>{userData.Client_Name}</i></td>
        </tr>
        <tr>
          <td className="custom-label">Job Description</td>
          <td style={{ wordWrap: 'break-word' }}>{userData.Job_Des}</td>
        </tr>
        <tr>
          <td className="custom-label">Location</td>
          <td>{userData.Location.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Job Mode</td>
          <td>{userData.Job_Mode.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Opening Position</td>
          <td>{userData.Open_position}</td>
        </tr>
        <tr>
          <td className="custom-label">Job Title</td>
          <td>{userData.Tech_stack.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Minimum Years of Experience</td>
          <td>{userData.min_Yre_of_exp.map(exp => exp.value)}</td>
        </tr>
        <tr>
          <td className="custom-label">Maximum Years of Experience</td>
          <td>{userData.max_Yre_of_exp.map(exp => exp.value)}</td>
        </tr>
        <tr>
          <td className="custom-label">Budget</td>
          <td>{userData.Budget}</td>
        </tr>
        <tr>
          <td className="custom-label">Posted By</td>
          <td>{userData.PostedUser}</td>
        </tr>
        <tr>
          <td className="custom-label">Download Jd</td>
          <td>
          <Button
            onClick={() => downloadResume(userData?.Job_Description || "N/A")}
            variant="outline-success"
          >
            Download
          </Button> &nbsp;
        <Button
  onClick={() => viewResumeInPDF(userData?.Job_Description || "N/A")}
  variant="outline-primary"
>
  View
</Button>
        </td>
        </tr> 
      </tbody>
    </Table>
      ) : (
        <p>No user data found.</p>   
      )}
    </Container>
  );
};

export default Viewadminpost;