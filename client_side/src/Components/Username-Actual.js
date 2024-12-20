import React from 'react';
import { Container, Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';
import '../style/Username.css';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernamevaldate } from '../helper/Validate';
import { useAuthStore } from '../store/store';

const Username = () => {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernamevaldate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/password')
    }
  })
  return (
    <Container fluid className="container-wrapper vh-100 d-flex align-items-center justify-content-center">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <Row>
        <Col className="text-center">
          <Card className="card-container title py-4"> 
            <Card.Body>
              <h4 className="text-5xl font-bold">Hello again!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">
                Exploring More by connecting with Us
              </span>
              <Form className="py-1" onSubmit={formik.handleSubmit}>
                <Row className="justify-content-center">
                  <Col xs={12} md={6}>
                    <div className="profile d-flex justify-content-center py-4">
                      <Image src={profile} alt="avatar" className="img-fluid" />
                    </div>
                  </Col>
                </Row>
                <div className="textbox d-flex flex-column align-items-center ">
                  <Form.Control {...formik.getFieldProps('username')} type="text" placeholder="User Name" className="w-75 mb-2" />
                  <Button type="submit" className="btn btn-success custom-button">Let's Go</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Username;