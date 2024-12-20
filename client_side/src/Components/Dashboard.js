import React,{useState,useEffect} from 'react';
import { Container,Row, Col, Card } from 'react-bootstrap';
import ImageSlider from './ImageSlide';
import Calander from './Calander'
import { getAdminPostbyStatus, fetchUserWorkingProgress } from '../helper/Helper';




const Dashboard = () => {
  const [postDetails, setPostDetails] = useState([]);
  const [data, setData] = useState([]);

  

  useEffect(() => {
    // Fetch data using getAdminPostbyStatus
    const fetchData = async () => {
      try {
        // Fetch data and sort by Ticket_no in descending order
        const data = await getAdminPostbyStatus(/* Add necessary parameters if required */);
        const sortedData = data.sort((a, b) => b.Ticket_no - a.Ticket_no);
        // Set only the first five items
        const limitedData = sortedData.slice(0, 6);
        setPostDetails(limitedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 



  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchUserWorkingProgress();
        setData(result);

      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);

      }
    }

    fetchData();
  }, []);

  const lastFiveRecords = Array.isArray(data) ? data.slice(-5) : [];
  return (
    <Container fluid className='pt-3'>
        
        <Row>
    <Col>
      <h4 className="mb-4">New Requirement Detail Dashboard:</h4>
    </Col>
  </Row>
  <Row className="mb-4">
  {postDetails.length > 0 ? (
    postDetails.slice(0, 6).map((post) => (
      <Col key={post._id} md={4} className="pt-1">
        <Card className="iconbox style_4" style={{ backgroundColor: '#FCFAFC' }}>
          <Card.Header>
            <div className="box-icon"></div>
            <Card.Title as="h5" style={{ color: '#3E2C66' }}>
              Client Name {post.Client_Name}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p>
              Posted date for the particular client is{' '}
              <strong>{new Date(post.date).toLocaleDateString('en-GB')}</strong>, the requirement number is{' '}
              <strong>{post.Ticket_no}</strong>, & the required Job Title is{' '}
              <strong>{post.Tech_stack.map((tech) => tech.value).join(', ')}</strong>
              ,client Location is{' '} <strong> {post.Location.map(Location => Location.value)}</strong>.
              The detail which was posted by our admin <strong>  {post.PostedUser}</strong>.
            </p>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <Col md={12}>
      <p>No records found.</p>
    </Col>
  )}
</Row>
  <Row className="mb-4">
    <Col xl={6} md={6} sm={12} className="mb-4">
      <div style={{ maxWidth: '100%', height: 'auto' }}>
        <ImageSlider />
      </div>
    </Col>
    <Col xl={6} md={6} sm={12} className="mb-4">
      <div style={{ maxWidth: '100%', height: 'auto' }}>
        <Calander />
      </div>
    </Col>
  </Row>
  <Row>
    <Col>
      <h4 className="mb-4">Current work in progress:</h4>
    </Col>
  </Row>
  <Row className="mt-2">
  {lastFiveRecords.length > 0 ? (
    lastFiveRecords.map((item, index) => (
      <Col key={index} md={6} lg={4} xl={3} className="mb-4">
       <Card bg={index % 2 === 0 ? 'dark' : 'light'} text={index % 2 === 0 ? 'light' : 'dark'} className="border-left-success shadow h-100 py-2" style={{ maxWidth: '400px' }}>
        <Card.Body>
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success  mb-1">
               Recruiter <strong> {item.username ? item.username.charAt(0).toUpperCase() + item.username.slice(1) : 'Username Missing'}</strong> posted new detail
                </div>
                
                <div className="mb-0 font-weight-bold text-gray-800">for the Client <strong> {item.Client_Name} </strong>,
                the Tech Stack which was provided by the client is{' '}
                <strong>{item.Tech_stack.map(tech => tech.value).join(', ')} </strong> & the requirement number is {item.Ticket_no}{" "}
                Total caniddate sourced for the particular client is <strong> {item.count} </strong>
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <Col md={12}>
      <p className="custom-text">No new record posted.</p>
    </Col>
  )}
</Row>
    </Container>
    
  );
};

export default Dashboard;