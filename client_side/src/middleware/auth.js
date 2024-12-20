import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { Container, Row, Col } from 'react-bootstrap';
import SideNavbar from '../Components/SideNavbar';
import HeaderNavbar from '../Components/HeaderNavbar';

export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/' replace={true} />;
  }
  
  return (
    <Container fluid className="authenticated-layout">
      <Row>
        <Col xs={2} md={2} lg={2} className="pt-5">
          <SideNavbar />
        </Col>
        <Col xs={12} md={9}>
          <HeaderNavbar />
          <div className="main-content">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const ProtectRoute = ({children})=>{
  const username= useAuthStore.getState().auth.username;
  const token = localStorage.getItem('token');
  // if(!username){
  //   return <Navigate to='/' replace={true}></Navigate>
  // }
  return children;
}