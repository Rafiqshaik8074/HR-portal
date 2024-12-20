import React, { useState, useEffect } from 'react';
import { getRecruterPostDetailsById } from '../helper/Helper';
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
        const response = await getRecruterPostDetailsById(userId);
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
            Candidate Details
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="custom-label">Ticket Number</td>
          <td>{userData.Ticket_no}</td>
        </tr>
        <tr>
          <td className="custom-label">Candidate Name</td>
          <td><i>{userData.CandidateName}</i></td>
        </tr>
        <tr>
          <td className="custom-label">Mobile Number</td>
          <td style={{ wordWrap: 'break-word' }}>{userData.MobileNumber}</td>
        </tr>
        <tr>
          <td className="custom-label">Email</td>
          <td>{userData.Email}</td>
        </tr>
        <tr>
          <td className="custom-label">Yre of Experiance</td>
          <td>{userData.Yre_of_expe.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Relevent Yre of Exp</td>
          <td>{userData.Relevent_Yre_of_exp.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Domain</td>
          <td>{userData.Domain.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">CTC</td>
          <td>{userData.CTC}</td>
        </tr>
        <tr>
          <td className="custom-label">ECTC</td>
          <td>{userData.ECTC}</td>
        </tr>
        <tr>
          <td className="custom-label">Current location</td>
          <td>{userData.Current_location.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Preffered location</td>
          <td>{userData.Preffered_location.map(tech => tech.value).join(', ')}</td>
        </tr>
        <tr>
          <td className="custom-label">Reason for change</td>
          <td>{userData.Reason_for_change}</td>
        </tr>
        <tr>
          <td className="custom-label">Notice peried</td>
          <td>{userData.Notice_peried}</td>
        </tr>
        <tr>
        <td className="custom-label">Candidate LWD</td>
        <td>{userData.Serving_Notice_Period_Date ? new Date(userData.Serving_Notice_Period_Date).toLocaleDateString() : 'N/A'}</td>
      </tr>
        <tr>
          <td className="custom-label">Current Company</td>
          <td>{userData.Current_Company}</td>
        </tr>
        <tr>
          <td className="custom-label">Availability</td>
          <td>{userData.Availability}</td>
        </tr>
        <tr>
          <td className="custom-label">Comment</td>
          <td>{userData.Comment}</td>
        </tr>
        <tr>
          <td className="custom-label">Status</td>
          <td>{userData.Status}</td>
        </tr>
        <tr>
          <td className="custom-label">Client feedback</td>
          <td>{userData.Client_feedback}</td>
        </tr>
        <tr>
          <td className="custom-label">Posted By</td>
          <td>{userData.username.charAt(0).toUpperCase() + userData.username.slice(1)}</td>
        </tr>
       
        <tr>
          <td className="custom-label">Download Resume</td>
          <td>
          <Button
            onClick={() => downloadResume(userData?.Upload_resume || "N/A")}
            variant="outline-success"
          >
            Download
          </Button> &nbsp;
        <Button
  onClick={() => viewResumeInPDF(userData?.Upload_resume || "N/A")}
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