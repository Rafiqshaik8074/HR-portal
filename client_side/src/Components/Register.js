import React, { useState } from 'react';
import { Container, Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import {useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registervalidation } from '../helper/Validate';
import convertToBase64 from '../helper/Convert';
import { registerUser } from '../helper/Helper';


const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      position:''
    },
    validate: registervalidation, 
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values.profile = file || '';

      const registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: 'Registering...',
        success: <b>Register Successfully...!</b>,
        error: <b>User already exists.</b>
      });

      registerPromise
        .then(() => {
          navigate('/home');
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            toast.error(<b>User already exists.</b>);
          }
        });
    }
  });

  const onUpload = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      setFile(base64);
    }
  }

  return (
    <Container fluid className="vh-80 d-flex align-items-center justify-content-center">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Row className="mt-2 pt-2">
        <Col className="text-center pt-5">
          <Card className="title py-4">
            <Card.Body>
              <h4 className="text-5xl font-bold">Register..!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">
                Happy to join you!
              </span>
              <Form className="py-1" onSubmit={formik.handleSubmit}>
                <Row className="justify-content-center">
                  <Col xs={12} md={6}>
                    <div className="profile d-flex justify-content-center py-4">
                      <Form.Group>
                        <Form.Label htmlFor="profile">
                          <Image src={file || profile} alt="avatar" className="img-fluid" />
                        </Form.Label>
                        <Form.Control
                          onChange={onUpload}
                          type="file"
                          id="profile"
                          name="profile"
                          className="d-none"
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
                <div className="textbox d-flex flex-column align-items-center ">
                  <Form.Control
                    {...formik.getFieldProps('email')}
                    type="text"
                    placeholder="Email*"
                    className="w-75 mb-2"
                    required
                  />
                  <Form.Control
                    {...formik.getFieldProps('username')}
                    type="text"
                    placeholder="Username*"
                    className="w-75 mb-2"
                    required
                  />
                  <Form.Control
                    {...formik.getFieldProps('password')}
                    type="password"
                    placeholder="Password*"
                    className="w-75 mb-2"
                    required
                  />
                 <Form.Control
                    as="select"
                    {...formik.getFieldProps('position')}
                    className="w-75 mb-2 custom-input"
                    required
                  >
                    <option value="" disabled>Select Role*</option>
                    <option value="admin">Admin</option>
                    <option value="recruiter">Recruiter</option>
                  </Form.Control>
                  <Button type="submit" className="btn btn-success custom-button">
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;