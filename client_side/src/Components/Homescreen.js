import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import Adminacseeforhome from './Adminacseeforhome';
import Adminagetdetails from './Adminagetdetails';
import Analiseuserwork from './Analiseuserwork';
import useFetch from '../hooks/Fetch.hook.js';
import Dashboard from './Dashboard.js';
import Recruiterreport from './Recruiterreport.js';

const Homescreen = () => {
  
  const [{apiData}] = useFetch();
  const userPosition = apiData?.position || '';

  return (
    <Container fluid className="p-0">
      <Row className='pt-5'>
        <Col xs={10} md={10} lg={10} className="pt-2">
          {userPosition === 'recruiter' ? (
            <Adminacseeforhome />
          ) : userPosition === 'admin' ? (
            <>
            <Dashboard/>
              <Adminagetdetails />
              <Analiseuserwork />
              <Recruiterreport/>
            </>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default Homescreen;