import React, { useState } from 'react';
import { Container, Row, Col, Image, Form, Button, Card,Spinner,Alert } from 'react-bootstrap';
import profile from '../assets/profile.png';
import '../style/Username.css';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/Validate';
import convertToBase64 from '../helper/Convert';
import useFetch from '../hooks/Fetch.hook.js';
import { updateUser } from '../helper/Helper';

const Profile = () => {
 
  const [file, setFile] = useState();
  const [{isLoading,apiData,serverError}]=useFetch()
  

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName||'',
      lastName: apiData?.lastName||'',
      mobile: apiData?.mobile ||'',
      email: apiData?.email ||'',
      address:apiData?.address ||''
    },
    enableReinitialize:true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values.profile = file || apiData?.profile || '';
      let updatePromise= updateUser(values)
      toast.promise(updatePromise,{
        loading:'Updating',
        success:<b>Updated Successfully..!</b>,
        error:<b>Could Not Update..</b>
      })
    }
  });

  const onUpload = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      setFile(base64);
    }
  }
  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  if (serverError) {
    return (
      <Alert variant="danger">
        {serverError.message}
      </Alert>
    );
  }

  return (
    <Container fluid className="vh-80 d-flex align-items-center justify-content-center pt-5">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <Row>
        <Col className="text-center">
          <Card className="title py-4 p-5">
            <Card.Body>
              <h4 className="text-5xl font-bold">Profile..!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">
                You can update the details
              </span>
              <Form className="py-1" onSubmit={formik.handleSubmit}>
                <Row className="justify-content-center">
                  <Col xs={12} md={6}>
                    <div className="profile d-flex justify-content-center py-4">
                      <Form.Group>
                        <Form.Label htmlFor='profile'>
                          <Image src={apiData?.profile || file || profile} alt="avatar" className="img-fluid" />
                        </Form.Label>
                        <Form.Control
                          onChange={onUpload}
                          type='file'
                          id='profile'
                          name='profile'
                          className="d-none"
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      {...formik.getFieldProps('firstName')}
                      type="text"
                      placeholder="First Name*"
                     
                    />
                  </Col>
                  <Col>
                    <Form.Control 
                      {...formik.getFieldProps('lastName')}
                      type="text"
                      placeholder="Last Name*"
                     
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      {...formik.getFieldProps('mobile')}
                      type="text"
                      placeholder="Mobile Number*"
                      
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      {...formik.getFieldProps('email')}
                      type="text"
                      placeholder="Email*"
                      disabled
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      as="textarea"
                      {...formik.getFieldProps('address')}
                      placeholder="Address*"
                     
                    />
                  </Col>
                </Row>

                <Button type="submit" className="btn btn-success custom-button">
                  Update
                </Button>

                <div className="textbox d-flex flex-column align-items-center"></div>
                <div className='align-items-center py-4'>
                  <span className='text-muted'>
                   
                  </span>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;