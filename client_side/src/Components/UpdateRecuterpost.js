import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { updateRecuterpost, getUserById,getAllTechstack } from '../helper/Helper';
import { useParams, useNavigate } from 'react-router-dom';
import convertToBase64 from '../helper/Convert';
import Loader from './Loader';
import useFetch from './../hooks/Fetch.hook';
import { useAuthStore } from '../store/store';
import Select from 'react-select';
import {customStyles,indianStateswithmetropolitanCities} from '../helper/Option';
import ReactSelect from 'react-select'; 

const UpdatePost = () => {
  const [file, setFile] = useState();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useAuthStore((state) => state.auth);
  const [{apiData}] = useFetch(`/user/${username}`);
  const [showAdditionalSelect, setShowAdditionalSelect] = useState(false);
  const [immediate_notice_period, setImmediate_notice_period] = useState(false);
  const [showServingNoticePeriod, setshowServingNoticePeriod] = useState(false);
  const [options, setOptions] = useState([]);

// Create a ref to track component mount status

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await getUserById(userId);
      setUserData(response);
      setShowAdditionalSelect(response?.Current_Company === 'Aroha Technologies');
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  fetchUserData();
}, [userId]);


  const formik = useFormik({
    initialValues: userData || {
      Ticket_no: '',
      CandidateName: '',
      MobileNumber: '',
      Email: '',
      Yre_of_expe: '',
      Relevent_Yre_of_exp: '',
      Domain: '',
      CTC: '',
      ECTC: '',
      Current_location: '', 
      Current_Company:'',
      Availability:'',
      Serving_Notice_Period_Date:'',
      Preffered_location: '',
      Reason_for_change: '', 
      Notice_peried: '',
      Comment: '',
      Status: '',
      Client_feedback: '',
      Upload_resume: ''
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      values.Upload_resume = file || null;

      const updatePromise = updateRecuterpost(userData._id, values);

      try {
        toast.promise(
          updatePromise,
          {
            loading: 'Updating...',
            success: () => {
              navigate('/searchform');
              return 'User details updated successfully!';
            },
            error: (error) => {
              console.error('Frontend Error:', error);

              if (error.response?.status === 409) {
                return 'User with the same data already exists.';
              } else {
                return 'Failed to update user details.';
              }
            },
          }
        );
      } catch (error) {
        console.error('Frontend Error:', error);
        toast.error('An error occurred during update.');
      }
    },
    enableReinitialize: true,
  });

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
  
    fetchOptions();
  
    // Cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, []); 

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
      formik.setErrors((formik.values, fileBase64));
    }
  };


  if (isLoading) {
    return (
     <Loader/>
    );
  }

  return (
    <Container fluid className="pt-5">
    <Toaster position="top-center" reverseOrder={false}></Toaster>
    <Row>
      <Col xs={12} md={12} lg={12}  >
        <Container fluid className="vh-100  align-items-center justify-content-center">
          <Row className="justify-content-center">
            <Col xs={10} md={10} lg={10} sm={12} className="text-center py-4">
              <Card className="title py-4 mt-30 shadow">
              <Card.Header className='pt-30'>
                    <h4 className="text-5xl font-bold">Update Candidate Profile..!</h4>
                    <span className="py-4 text-xl w-2/3 text-center text-muted">
                    
                    </span>
                  </Card.Header>
                <Card.Body>
                  <Form onSubmit={formik.handleSubmit} className='pt-4'>
                  <Row>
                    <Col xs={2}>
                      <label>Req.No</label>
                    </Col>
                    <Col xs={3}>
                      <Form.Control
                        {...formik.getFieldProps('Ticket_no')}
                        type="number"
                        placeholder="Ticket_no*"
                        className="w-100 mb-2"
                        disabled={apiData && apiData.position !== 'admin'}
                        required
                      />
                    </Col>
                  </Row>
                    <Row>
                      <Col xl={2}>
                      <label>Name</label> 
                      </Col>
                      <Col xs={4}>
              
                        <Form.Control
                          {...formik.getFieldProps('CandidateName')}
                          type="text"
                          placeholder="Candidate Name*"
                          className="w-100 mb-2"
                          required
                          disabled
                        />
                      </Col>
                      <Col xl={2}>
                      <label>Mobile</label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          {...formik.getFieldProps('MobileNumber')}
                          type="tel"
                          placeholder="Mobile Number*"
                          className="w-100 mb-2"
                          required
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                    <Col xl={2}>
                      <label>Email</label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          {...formik.getFieldProps('Email')}
                          type="email"
                          placeholder="Email*"
                          className="w-100 mb-2"
                          required
                          disabled
                        />
                      </Col>
                      <Col xl={2}>
                      <label>Domain</label>
                      </Col>
                      <Col xs={4}>
                      <Select
                            options={options}
                            isMulti
                            value={formik.values.Domain}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Domain', selectedOptions);
                            }}
                            placeholder="Domain/Skill Set*"
                            className="w-100 mb-2 text-center"
                            styles={customStyles}
                            required
                          />
                      </Col>
                    </Row>
                    <Row>
                    <Col xl={2}>
                      <label>CTC</label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          {...formik.getFieldProps('CTC')}
                          type="number"
                          placeholder="CTC*"
                          className="w-100 mb-2"
                          required
                        />
                      </Col>
                      <Col xl={2}>
                      <label>ECTC</label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          {...formik.getFieldProps('ECTC')}
                          type="number"
                          placeholder="ECTC*"
                          className="w-100 mb-2"
                          required
                        />
                      </Col>
                    </Row>
                    <Row>
                    <Col xl={2}>
                      <label>YOE</label>
                      </Col>
                      <Col xs={4}>
                      <ReactSelect
                          name="Yre_of_expe" // Add a name property
                          value={formik.values.Yre_of_expe} // Set the value prop
                          options={Array.from({ length: 50 }, (_, index) => ({
                            value: index + 1,
                            label: (index + 1).toString(),
                          }))}
                          onChange={(selectedOption) => {
                            formik.setFieldValue('Yre_of_expe', selectedOption); // Update the field value
                          }}
                          styles={customStyles}
                          isSearchable={true} 
                          placeholder="Select Years of Experience"
                          required
                        />
                      </Col>
                      <Col xl={2}>
                      <label>RYOE</label>
                      </Col>
                      <Col xs={4}>
                      <ReactSelect
                            name="Relevent_Yre_of_exp"
                            value={formik.values.Relevent_Yre_of_exp}
                            options={Array.from({ length: 50 }, (_, index) => ({
                              value: index + 1,
                              label: (index + 1).toString(),
                            }))}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Relevent_Yre_of_exp', selectedOptions);
                            }}
                            styles={customStyles}
                            isSearchable={true} 
                            placeholder="Select Relevant Years of Experience"
                            required
                          />
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                    <Col xl={3}>
                      <label>Current Location</label>
                      </Col>
                      <Col xs={3}>
                      <Select
                        options={indianStateswithmetropolitanCities}
                        value={formik.values.Current_location} // Set the value prop to the selected option
                        onChange={(selectedOption) => {
                          formik.setFieldValue('Current_location', selectedOption);
                        }}
                        placeholder="Current Location*"
                        className="w-100 mb-2"
                        styles={customStyles}
                        isSearchable={true} 
                   
                      />
                      </Col>
                      <Col xl={3}>
                      <label>Preferred location</label>
                      </Col>
                      <Col xs={3}>
                      <Select
                        options={indianStateswithmetropolitanCities}
                        value={formik.values.Preffered_location} // Set the value prop to the selected option
                        onChange={(selectedOption) => {
                          formik.setFieldValue('Preffered_location', selectedOption);
                        }}
                        placeholder="Preffered Location*"
                        className="w-100 mb-2"
                        styles={customStyles}
                        isSearchable={true} 
                       
                      />
                      </Col>
                    </Row>
                    <Row>
                    <Col xs={3}>

                    <Form.Label>Notice Period Date</Form.Label>
                    </Col>
                      <Col xs={3}>
                      <Form.Select
                        {...formik.getFieldProps('Notice_peried')}
                        className="custom-placeholder-style w-100 mb-2 text-center"
                        onChange={(e) => {
                          formik.handleChange(e);
                          setshowServingNoticePeriod(e.target.value === 'Serving Notice Period');
                          setImmediate_notice_period(e.target.value === 'Immediate')
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
                      <Col xs={3}>
                      <Form.Label>Current Company</Form.Label>
                      </Col>
                      <Col xs={3}>
                      <Form.Control
                        {...formik.getFieldProps('Current_Company')}
                        list="Current_Company"
                        placeholder="Current Company"
                        className="custom-placeholder-style w-100 mb-2 text-center"  
                        onChange={(e) => {
                          formik.handleChange(e);
                          setShowAdditionalSelect(e.target.value === 'Aroha Technologies');
                        }}
                      />
                        <datalist id="Current_Company">
                          <option>Aroha Technologies</option>
                          <option>TCS</option>
                          <option>WIPRO</option>
                          <option>infosis</option>
                        </datalist>
                      </Col>
                    </Row>
       
                    <Row>
                      <Col xs={6}>
                      {(showServingNoticePeriod || immediate_notice_period) && (
                <Row>
                       <Col xs={6}>
                   <Form.Label>Candidate LWD</Form.Label>
                   </Col>
                   <Col xs={6}>
                <Form.Control
                  type="date"
                  {...formik.getFieldProps('Serving_Notice_Period_Date')}
                  className="custom-placeholder-style" // Add any additional styling here
                  required={showServingNoticePeriod}
                />     
                </Col>        
              </Row>
            )}
                      </Col>
                      {showAdditionalSelect && (
                      <Col xs={3}>
                   <Form.Label>Availability</Form.Label>
                   </Col>
                     )}
                      <Col xs={3}>
                      {showAdditionalSelect && (
           
                  <Form.Select
                    {...formik.getFieldProps('Availability')}
                    className="custom-placeholder-style w-100 mb-2 text-center"
                    required
                  >
                    <option value="">Select Availability</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
            
            )}
                      </Col>
                    </Row>
                    
                    <Row>
                    <Col xl={2}>
                      <label>Status</label>
                      </Col>
                      <Col xs={4}>
                      <Form.Select
                        {...formik.getFieldProps('Status')}
                        className="w-100 mb-2"
                        disabled={apiData && apiData.position !== 'admin'}
                        required
                      >  
                        <option value="">Selected</option>
                        <option value="Selected By Aroha">Selected By Aroha</option>
                        <option value="Selected By Client">Selected By Client</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Rejected By Aroha">Rejected By Aroha</option>
                        <option value="Rejected By Client">Rejected By Client</option>
                        <option value="Yet to Scheduled">Yet to Scheduled</option>
                        <option value="Re-Scheduled">Re-Scheduled</option>
                        <option value="Yet to Receive feedback">Yet to Receive feedback</option>
                        <option value="On Hold">On Hold</option>
                      </Form.Select>
                    </Col>
                      <Col xs={2}>
                      <Form.Label>Upload Resume</Form.Label>
                      </Col>
                      <Col xs={4}>
                      <Form.Control
                          onChange={onUpload}
                          type="file"
                          id="Upload_resume"
                          name="Upload_resume"
                          placeholder='Ulpoad resume'
                        />
                      </Col>
                    </Row>
                    <Row>
                    <Col xl={3}>
                      <label>Client feedback</label>
                      </Col>
                         <Col xs={3}>
                        <Form.Control
                          {...formik.getFieldProps('Client_feedback')}
                          type="text"
                          placeholder="Client feedback"
                          className="w-100 mb-2"
                          disabled={apiData && apiData.position !== 'admin'}
                        />
                      </Col>
                        <Col xl={2}>
                      <label>Comment</label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          {...formik.getFieldProps('Comment')}
                          type="textarea"
                          placeholder="Comment"
                          className="w-100 mb-2"
                          disabled={apiData && apiData.position !== 'admin'}
                        />
                      </Col>
                    </Row>
                    <Button type="submit" variant="outline-info">
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
  </Container>
  );
};

export default UpdatePost;