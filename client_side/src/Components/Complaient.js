import React from 'react';
import { useFormik } from 'formik';
import { complaient } from '../helper/Helper'; // Import your API function
import { Form, Button, Col, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

const Complaient = () => {
    const formik = useFormik({
      initialValues: {
        complaient: '',
      },
      onSubmit: async (values) => {
        const promise = complaient({ Complaient: values.complaient });
        
        toast.promise( 
            promise,
            {
              loading: 'Sending suggestion...',
              success: 'User Suggestion sent successfully',
              error: (error) => {
                if (error.includes('Complaint is required')) {
                    return 'Complaint is required';
                  }  else {
                  return 'An error occurred while sending suggestion';
                }
              },
            }
          );
        
        formik.resetForm();
      },
    });
  
    return (
      <div>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group as={Row} controlId="complaient">
            <Col sm={10}>
            <Form.Control
            {...formik.getFieldProps('complaient')}
            as="textarea"
             placeholder="Give your valuable suggestion/feedback to developer*"
              className="w-100  mb-2"
              style={{ height: '130px' }}
              />
            </Col>
          </Form.Group>
          <br/>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  };
  
  export default Complaient;