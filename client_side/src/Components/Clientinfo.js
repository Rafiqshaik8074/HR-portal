import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import { clientValidate } from '../helper/Validate';
import { postClientDetails, getClientNames } from '../helper/Helper'; // Adjust the path as necessary
import toast, { Toaster } from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

const Clientinfo = () => {
  const [clientNameOptions, setClientNameOptions] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState(null);

  const formik = useFormik({
    initialValues: {
      Clientname: '',
      Address: '',
      Email: '',
      MobileNumber: '',
      HrEmail: '',
      HrMobileNumber: ''
    },
    validate: clientValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const recuterpostPromise = postClientDetails(values);

      try {
        toast.promise(
          recuterpostPromise,
          {
            loading: 'Submitting client details...',
            success: () => {
              resetForm(); // Reset the form fields
              setSelectedClientName(null); // Reset selected client name
              return 'Client created successfully!';
            },
            error: (error) => {
              console.log('Frontend Error:', error);
              if (error.response && error.response.status === 409) {
                return 'Client with the same email or mobile number already exists';
              } else {
                return 'An error occurred while creating the client: ' + (error.message || 'Unknown error');
              }
            },
          }
        );
      } catch (error) {
        console.log('Frontend Error:', error);
        toast.error('An error occurred during registration.');
      }
    },
  });

  // Fetch client names when component mounts
  useEffect(() => {
    const fetchClientNames = async () => {
      try {
        const response = await getClientNames();
        const data = response.clientNames; // Access the clientNames array

        // Ensure that data is an array
        if (Array.isArray(data)) {
          // Map data to format expected by CreatableSelect
          const options = data.map(name => ({ value: name, label: name }));
          setClientNameOptions(options);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        toast.error('Failed to fetch client names');
        console.error('Error fetching client names:', error);
      }
    };

    fetchClientNames();
  }, []);

  // Handle changes in CreatableSelect
  const handleClientNameChange = (selectedOption) => {
    setSelectedClientName(selectedOption);
    formik.setFieldValue('Clientname', selectedOption ? selectedOption.value : '');
  };

  return (
    <Container fluid className="pt-5 d-flex align-items-center justify-content-center">
      <Toaster position="top-center" reverseOrder={false} />
      <Row className="w-100">
        <Col xs={12} md={12} lg={12} className="text-center py-4">
          <Card className="title py-4 mt-30 pt-5 d-flex flex-column">
            <Card.Header className='pt-30'>
              <h4 className="text-5xl font-bold">Add Client Details!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">
                {/* Additional text or content */}
              </span>
            </Card.Header>
            <Card.Body className="flex-grow-1">
            <Form onSubmit={formik.handleSubmit} className='pt-4'>
  <Row>
    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('Clientname')}
        placeholder="Client Name*"
        className="mb-2"
        isInvalid={!!formik.errors.Clientname}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.Clientname}
      </Form.Control.Feedback>
    </Col>

    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('Address')}
        as="textarea"
        placeholder="Address*"
        className="custom-placeholder-style w-100 mb-2 text-center"
        isInvalid={!!formik.errors.Address}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.Address}
      </Form.Control.Feedback>
    </Col>
  </Row>
  <br />
  <Row>
    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('Email')}
        type="email"
        placeholder="E-mail*"
        className="custom-placeholder-style w-100 mb-2 text-center"
        isInvalid={!!formik.errors.Email}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.Email}
      </Form.Control.Feedback>
    </Col>

    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('MobileNumber')}
        type="tel"
        placeholder="Mobile Number*"
        className="custom-placeholder-style w-100 mb-2 text-center"
        isInvalid={!!formik.errors.MobileNumber}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.MobileNumber}
      </Form.Control.Feedback>
    </Col>
  </Row>
  <br />
  <Row>
    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('HrEmail')}
        type="email"
        placeholder="HR E-mail*"
        className="custom-placeholder-style w-100 mb-2 text-center"
        isInvalid={!!formik.errors.HrEmail}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.HrEmail}
      </Form.Control.Feedback>
    </Col>

    <Col xs={6}>
      <Form.Control
        {...formik.getFieldProps('HrMobileNumber')}
        type="tel"
        placeholder="HR Mobile Number*"
        className="custom-placeholder-style w-100 mb-2 text-center"
        isInvalid={!!formik.errors.HrMobileNumber}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors.HrMobileNumber}
      </Form.Control.Feedback>
    </Col>
  </Row>

  <br />
  <Button type="submit" className="btn btn-success">
    Update
  </Button>
</Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Clientinfo;