import React from 'react';
import { Nav, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FileEarmarkBarGraphFill, 
  HouseFill, 
  Eye, 
  PeopleFill, 
  SearchHeart, 
  // ChatSquareText, 
  PencilFill, 
  PersonPlusFill, 
  InfoCircleFill 
} from 'react-bootstrap-icons';
import useFetch from '../hooks/Fetch.hook.js';
import './SideNavbar.css';

const SideNavbar = () => {
  const [{ isLoading, apiData }] = useFetch();

  const userPosition = apiData?.position || '';

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="side-navbar">
      <Nav defaultActiveKey="/" className="flex-column">
        <div className="row">
          <div className="nav-link-row">
            <Nav.Link as={Link} to="/home" className="nav-link">
              <HouseFill className="nav-link-icon" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/arohabenchresource" className="nav-link">
              <Eye className="nav-link-icon" />
              Bench Resource
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/App1" className="nav-link">
              <ChatSquareText className="nav-link-icon" />
              Chat
            </Nav.Link> */}
          </div>
        </div>
        {userPosition === 'recruiter' ? (
          <div className="row">
            <div className="nav-link-row">
              <Nav.Link as={Link} to="/admindetailsacess" className="nav-link">
                <PeopleFill className="nav-link-icon" />
                Candidate
              </Nav.Link>
              <Nav.Link as={Link} to="/searchform" className="nav-link">
                <SearchHeart className="nav-link-icon" />
                Search
              </Nav.Link>
            </div>
          </div>
        ) : userPosition === 'admin' ? (
          <div className="row">
            <div className="nav-link-row">
              <Nav.Link as={Link} to="/admindetailsacess" className="nav-link">
                <PeopleFill className="nav-link-icon" />
                Candidate
              </Nav.Link>
              <Nav.Link as={Link} to="/searchform" className="nav-link">
                <SearchHeart className="nav-link-icon" />
                Search
              </Nav.Link>
              <Nav.Link as={Link} to="/adminpost" className="nav-link">
                <FileEarmarkBarGraphFill className="nav-link-icon" />
                New Requirement
              </Nav.Link>
              <Nav.Link as={Link} to="/searchadminpost" className="nav-link">
                <PencilFill className="nav-link-icon" />
                Edit Requirement
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-link">
                <PersonPlusFill className="nav-link-icon" />
                User Registration
              </Nav.Link>
              <Nav.Link as={Link} to="/getCountByTicket" className="nav-link">
                <FileEarmarkBarGraphFill className="nav-link-icon" />
                Report
              </Nav.Link>
              <Nav.Link as={Link} to="/getclientdetails" className="nav-link">
                <InfoCircleFill className="nav-link-icon" />
                Client
              </Nav.Link>
            </div>
          </div>
        ) : null}
      </Nav>
    </div>
  );
};

export default SideNavbar;