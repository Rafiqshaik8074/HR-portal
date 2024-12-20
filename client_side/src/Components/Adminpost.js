import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../helper/Convert';
import { Adminpost, getClientNames,getAllTechstack ,getClients } from '../helper/Helper'; // Ensure `getClientNames` is imported
import { adminPostValidate } from '../helper/Validate';
import './FontText.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select'; 
import { jobModeOptions, modeOptions, customStyles, indianStateswithmetropolitanCities } from '../helper/Option';

const Adminposts = () => {
  const [file, setFile] = useState();
  const [showModal, setShowModal] = useState(false);
  const [postedDetails, setPostedDetails] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [showServingNoticePeriod, setshowServingNoticePeriod] = useState(false);
  const [options, setOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]); // Add this state for client names

  const formik = useFormik({
    initialValues: {
      Client_Name: '',
      Open_position: '',
      Notice_peried: '',
      Serving_Notice_Period_Date: '',
      min_Yre_of_exp: [],
      max_Yre_of_exp: [],
      Tech_stack: [],
      Budget: '',
      Location: [],
      Job_Description: '',
      Job_Des: '',
      Job_Mode: '',
      Mode: '',
      status: "Open"
    },
    validate: adminPostValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      if (!values.Job_Des && !file) {
        toast.error('Please provide a Job Description or upload a file.');
        return;
      }
      values.Job_Description = file || '';

      const AdminpostPromise = Adminpost(values);

      resetForm();

      toast.promise(AdminpostPromise, {
        loading: 'Updating...',
        success: (data) => {
          setTicketNumber(data.adminModule.Ticket_no);
          setPostedDetails(values);
          setShowModal(true); // Show the modal after posting
          return <b>Registered Successfully...!</b>;
        },
        error: <b>Could Not Register.</b>
      });
    }
  });

  const onUpload = async (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      // Check if the file has a valid extension (e.g., .doc or .pdf)
      const allowedFileExtensions = ['doc', 'docx', 'pdf'];
      const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

      if (!allowedFileExtensions.includes(fileExtension)) {
        // Handle invalid file extension (e.g., show an error message)
        console.error('Invalid file extension. Please upload a document or PDF.');
        return;
      }

      // Convert the uploaded file to base64
      const fileBase64 = await convertToBase64(uploadedFile);
      setFile(fileBase64);

      // Validate with updated file
      formik.setErrors(adminPostValidate(formik.values, fileBase64));
    }
  };

  // Function to hide the modal
  const hideModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Fetch options from API when the component mounts
    const fetchOptions = async () => {
      try {
        const optionsData = await getAllTechstack();
        // Check if the response is an array
        if (Array.isArray(optionsData)) {
          // Capitalize the first letter of label and value properties
          const formattedOptions = optionsData.map(option => ({
            label: option.label.charAt(0).toUpperCase() + option.label.slice(1),
            value: option.value.charAt(0).toUpperCase() + option.value.slice(1)
          }));

          // Set the options state with formatted data
          setOptions(formattedOptions);
        } else {
          console.error('Response is not an array:', optionsData);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    // Fetch client names from API
    const fetchClientNames = async () => {
      try {
        const response =  await getClients(); // Ensure this API endpoint is available
        const clientNames = response?.clients?.map(item => ({
          label: item.Clientname,
          value: item.Clientname
        }));
        setClientOptions(clientNames);
      } catch (error) {
        console.error('Error fetching client names:', error);
      }
    };

    fetchOptions();
    fetchClientNames();

    // Cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, []);

  return (
    <Container fluid className="p-0">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Row>
        <Col xs={10} md={10} lg={12} className='pt-5'>
          <Container fluid className="vh-100 align-items-center justify-content-center">
            <Row className="justify-content-center">
              <Col xs={10} md={10} lg={10} className="text-center py-4">
                <Card className="title py-4 mt-30">
                  <Card.Header className='pt-30'>
                    <h4 className="text-5xl font-bold">Post New Client Requirements..!</h4>
                    <span className="py-4 text-xl w-2/3 text-center text-muted"></span>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={formik.handleSubmit} className='pt-4'>
                      <Row>
                        <Col xs={6}>
                          <Form.Select
                            {...formik.getFieldProps('status')}
                            disabled
                            className="custom-placeholder-style w-100 mb-2 text-center"
                          >
                            <option value="Open">Status: Open</option>
                          </Form.Select>
                        </Col>
                        <Col xs={6}>
                          <CreatableSelect
                            options={clientOptions}
                            value={formik.values.Client_Name ? { label: formik.values.Client_Name, value: formik.values.Client_Name } : null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('Client_Name', selectedOption ? selectedOption.value : '');
                            }}
                            placeholder="Client Name*"
                            className="w-100 mb-2 text-center"
                            isClearable
                            styles={customStyles}
                            required
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <CreatableSelect
                            options={options}
                            isMulti
                            value={formik.values.Tech_stack}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Tech_stack', selectedOptions);
                            }}
                            placeholder="Domain/Skill Set*"
                            className="w-100 mb-2 text-center"
                            styles={customStyles}
                            required
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            {...formik.getFieldProps('Open_position')}
                            type="number"
                            placeholder="Opening Position*"
                            className="custom-placeholder-style w-100 mb-2 text-center"
                            required
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <ReactSelect
                            name="min_Yre_of_exp"
                            value={formik.values.min_Yre_of_exp}
                            options={Array.from({ length: 51 }, (_, index) => ({
                              value: index,
                              label: index.toString(),
                            }))}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('min_Yre_of_exp', selectedOption);
                            }}
                            styles={customStyles}
                            isSearchable={true}
                            placeholder="Select Min Years of Experience"
                            required
                          />
                        </Col>
                        <Col xs={6}>
                          <ReactSelect
                            name="max_Yre_of_exp" // Add a name property
                            value={formik.values.max_Yre_of_exp} // Set the value prop
                            options={Array.from({ length: 50 }, (_, index) => ({
                              value: index + 1,
                              label: (index + 1).toString(),
                            }))}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('max_Yre_of_exp', selectedOption); // Update the field value
                            }}
                            styles={customStyles}
                            isSearchable={true}
                            placeholder="Select Max Years of Experience"
                            required
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <Form.Control
                            {...formik.getFieldProps('Budget')}
                            type="number"
                            placeholder="Budget in Lakhs*"
                            className="custom-placeholder-style w-100 mb-2 text-center"
                            required
                          />
                        </Col>
                        <Col xs={6}>
                          <Select
                            options={indianStateswithmetropolitanCities}
                            isMulti
                            value={formik.values.Location} // Set the value prop to the selected option
                            onChange={(selectedOption) => {
                              formik.setFieldValue('Location', selectedOption);
                            }}
                            placeholder="Location*"
                            className="w-100 mb-2"
                            styles={customStyles}
                            isSearchable={true}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <Select
                            options={jobModeOptions}
                            isMulti
                            value={formik.values.Job_Mode} // Set the value prop to the selected options
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Job_Mode', selectedOptions);
                            }}
                            placeholder="Job Mode*"
                            className="w-100 mb-2 text-center"
                            styles={customStyles}
                            required
                          />
                        </Col>
                        <Col xs={6}>
                          <Select
                            options={modeOptions}
                            isMulti
                            value={formik.values.Mode} // Set the value prop to the selected options
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Mode', selectedOptions);
                            }}
                            placeholder="Working Mode*"
                            className="custom-placeholder-style w-100 mb-2 text-center"
                            styles={customStyles}
                            required
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <Form.Select
                            {...formik.getFieldProps('Notice_peried')}
                            className="custom-placeholder-style w-100 mb-2 text-center"
                            onChange={(e) => {
                              formik.handleChange(e);
                              setshowServingNoticePeriod(e.target.value === 'Serving Notice Period');
                            }}
                            required
                          >
                            <option value="">Select Notice period*</option>
                            <option value="Serving Notice Period">Serving Notice Period</option>
                            <option value="Immediate">Immediate</option>
                            <option value="7 days">7 days</option>
                            <option value="15 days">15 days</option>
                            <option value="30 days">30 days</option>
                            <option value="45 days">45 days</option>
                            <option value="60 days">60 days</option>
                            <option value="90 days">90 days</option>
                          </Form.Select>
                        </Col>
                        {showServingNoticePeriod && (
                          <>
                            <Col xs={2}>
                              <Form.Label>Candidate LWD</Form.Label>
                            </Col>
                            <Col xs={4}>
                              <Form.Control
                                type="date"
                                {...formik.getFieldProps('Serving_Notice_Period_Date')}
                                className="custom-placeholder-style"
                                required
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                      <br />
                      <Row>
                        <Col xs={6}>
                          <Form.Control
                            {...formik.getFieldProps('Job_Des')}
                            as="textarea"
                            placeholder="Job Description*"
                            className="custom-placeholder-style w-100 mb-2 text-center"
                            style={{ height: '150px' }}
                          />
                        </Col>
                        <Col xs={2}>
                          <Form.Label>Upload Job Description:</Form.Label>
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            onChange={onUpload}
                            type="file"
                            id="Upload_resume"
                            name="Upload_resume"
                          />
                        </Col>
                      </Row>

                      <Button type="submit" variant='info' className="custom-button">
                        Update
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      {/* Modal to display posted details */}
      <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Posted Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ticketNumber && (
            <div>
              <strong>Ticket Number: {ticketNumber}</strong>
            </div>
          )}
          {postedDetails && (
            <div>
              <Row>
                <Col>
                  <p>Client Name: {postedDetails.Client_Name}</p>
                </Col>
                <Col>
                  <p>Open Position: {postedDetails.Open_position}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  {postedDetails.min_Yre_of_exp && (
                    <p>Min Year exp: {postedDetails.min_Yre_of_exp.value}</p>
                  )}
                </Col>
                <Col>
                  {postedDetails.max_Yre_of_exp && (
                    <p>Max Year exp: {postedDetails.max_Yre_of_exp.value}</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>Budget: {postedDetails.Budget}</p>
                </Col>
                <Col>
                  <p>Tech Stack: {postedDetails.Tech_stack.map(tech => tech.value).join(', ')}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>Status: {postedDetails.status}</p>
                </Col>
                <Col>
                  <p>Location: {postedDetails.Location.map(loc => loc.value).join(', ')}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Adminposts;