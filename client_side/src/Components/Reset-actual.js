import React, { useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import {  Navigate } from 'react-router-dom';
import '../style/Username.css';
import { Toaster, toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/Validate';
import { resetPassword } from '../helper/Helper';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/Fetch.hook';

const Reset = () => {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');

  useEffect((status) => {
    if (status) {
      // Handle status
    }
  }, [isLoading, apiData, serverError]);

  const onSubmit = async (values) => {
    try {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: 'Updating',
        success: <b>Reset successfully..!</b>,
        error: <b>Could Not Reset!</b>,
      });

      await resetPromise;
      navigate('/password');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      Confirm_pwt: '',
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: onSubmit,
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.setItem('resetPageRefreshed', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const resetPageRefreshed = localStorage.getItem('resetPageRefreshed');

    if (resetPageRefreshed) {
      localStorage.removeItem('resetPageRefreshed');
      navigate('/');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (serverError) {
    return <Alert variant="danger">{serverError.message}</Alert>;
  }

  if (status && status !== 201) {
    return <Navigate to="/password" replace={true} />;
  }

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Row>
        <Col className="text-center">
          <Card className="title py-5" style={{ width: '500px' }}>
            <Card.Body>
              <h4 className="text-5xl font-bold">Reset!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">Enter new password</span>
              {/* Add a hidden username field */}
              <Form className="pt-20" onSubmit={formik.handleSubmit}>
                <input type="hidden" name="username" value={username} />
                <div className="textbox d-flex flex-column align-items-center ">
                  <Form.Control
                    {...formik.getFieldProps('password')}
                    type="password"
                    placeholder="New Password"
                    className="w-75 mb-2"
                    autoComplete="new-password"
                  />
                  <Form.Control
                    {...formik.getFieldProps('Confirm_pwt')}
                    type="password"
                    placeholder="Repeat Password"
                    className="w-75 mb-2"
                    autoComplete="new-password"
                  />
                  <Button type="submit" className="btn btn-success custom-button">
                    Reset
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

export default Reset;