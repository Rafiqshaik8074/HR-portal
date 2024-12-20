import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { recuterpost, getAdmindetailsById,getAllTechstack } from '../helper/Helper';
import { recuterValidate } from '../helper/Validate';
import { useParams } from 'react-router-dom';
import convertToBase64 from '../helper/Convert';
import Loader from './Loader';
import Select from 'react-select';
import {customStyles,indianStateswithmetropolitanCities } from '../helper/Option';
import ReactSelect from 'react-select'; 



const UpdatePost = () => {
  const [file, setFile] = useState();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdditionalSelect, setShowAdditionalSelect] = useState(false);
  const [showServingNoticePeriod, setshowServingNoticePeriod] = useState(false);
  const [immediate_notice_period, setImmediate_notice_period] = useState(false);
  const [additionalFieldVisible, setAdditionalFieldVisible] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAdmindetailsById(userId);
        setUserData(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };  

    fetchUserData(); // Fetch data on every update

  }, [userId]);

  const formik = useFormik({
    initialValues: {
      Ticket_no: userData ? userData.Ticket_no : '',
      CandidateName: '',
      MobileNumber: '',
      Email:'',
      Yre_of_expe: '',
      Relevent_Yre_of_exp:'',
      Domain: '',
      CTC: '',
      ECTC: '',
      Current_location: '',
      Preffered_location: '',
      Reason_for_change: '',
      Notice_peried: '',
      Comment: '',
      Referral:'',
      Referral_MobileNumber:'',
      Status: '',
      Current_Company:'',
      Availability:'',
      Serving_Notice_Period_Date:'',
      Client_feedback:'',
      Upload_resume: '',
      current_offer:'',
      offer_details:''
    },
    validate: recuterValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      values.Upload_resume = file || null; // Set to null if no file is selected

      const recuterpostPromise = recuterpost(values);
      // console.log('recute post promises',recuterpostPromise)
      // console.log('values',values)

      try {
        toast.promise(
          recuterpostPromise,
          {
            loading: 'Registering...',
            success: () => {
              resetForm();
              return 'Registered Successfully...!';
            },
            error: (error) => {
              console.log('Frontend Error:', error);
              if (error.response && error.response.status === 409) {
                return 'Candidate with the same Email or MobileNumber already exists';
              } else {
                return 'Could Not Register. ' + error;
              }
            },
          }
        );
      } catch (error) {
        console.log('Frontend Error:', error);
        toast.error('An error occurred during registration.');
      }
    },

    enableReinitialize: true,
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
      formik.setErrors(recuterValidate(formik.values, fileBase64));
    }
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
  
    fetchOptions();
  
    // Cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, []); 


   
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
            <Card className="title py-4 mt-30 pt-5">
              <Card.Header className='pt-30'>
                    <h4 className="text-5xl font-bold">Update Candidate Profile..!</h4>
                    <span className="py-4 text-xl w-2/3 text-center text-muted">
                  
                    </span>
                  </Card.Header>
                <Card.Body>
                 <Form onSubmit={formik.handleSubmit} className='pt-4'>
                  <Row>
                    <Col xs={2}>
                       <label>Req.No:</label>
                     </Col>
                    <Col xs={3}>                   
                     <Form.Control
                        {...formik.getFieldProps("Ticket_no")}
                        type="number"
                        placeholder="Ticket_no*"
                        className="custom-placeholder-style w-100 mb-2 text-center" 
                        disabled
                      />
                    </Col>
                  </Row>
                    <Row>
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('CandidateName')}
                          type="text"
                          placeholder="Candidate Name*"
                          className="custom-placeholder-style w-100 mb-2 text-center"  
                          required
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('MobileNumber')}
                          type="tel"
                          placeholder="Mobile Number*"
                          className="custom-placeholder-style w-100 mb-2 text-center"  
                          required
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('Email')}
                          type="email"
                          placeholder="Email*"
                          className="custom-placeholder-style w-100 mb-2 text-center"  
                          required
                        />
                      </Col>
                      <Col xs={6}>
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
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('CTC')}
                          type="number"
                          placeholder="CTC in Lakhs*"
                          className="custom-placeholder-style w-100 mb-2 text-center"  
                          required
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('ECTC')}
                          type="number"
                          placeholder="ECTC in Lakhs*"
                          className="custom-placeholder-style w-100 mb-2 text-center" 
                          required
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>                                   
                      <ReactSelect
                          name="Yre_of_expe"
                          value={formik.values.Yre_of_expe}
                          options={Array.from({ length: 51 }, (_, index) => ({
                            value: index,
                            label: index.toString(),
                          }))}
                          onChange={(selectedOption) => {
                            formik.setFieldValue('Yre_of_expe', selectedOption);
                          }}
                          styles={customStyles}
                          isSearchable={true}
                          placeholder="Select Years of Experience"
                          required
                        />
                      </Col>
                      <Col xs={6}>        
                      <ReactSelect
                          name="Relevent_Yre_of_exp"
                          value={formik.values.Relevent_Yre_of_exp}
                          options={Array.from({ length: 51 }, (_, index) => ({
                            value: index,
                            label: index.toString(),
                          }))}
                          onChange={(selectedOption) => {
                            formik.setFieldValue('Relevent_Yre_of_exp', selectedOption);
                          }}
                          styles={customStyles}
                          isSearchable={true}
                          placeholder="Select Relevent Years of Exp"
                          required
                        />
                      </Col>
                     
                    </Row>
                    <br/>
                    <Row>
                    <Col xs={6}>
                    <Select
                        options={indianStateswithmetropolitanCities}
                        value={formik.values.Current_location} // Set the value prop to the selected option
                        onChange={(selectedOption) => {
                          formik.setFieldValue('Current_location', selectedOption);
                        }}
                        placeholder="Current Location"
                        className="w-100 mb-2"
                        styles={customStyles}
                        isSearchable={true} 
                      
                      />
                      </Col>
                      <Col xs={6}>
                      <Select
                        options={indianStateswithmetropolitanCities}
                        value={formik.values.Preffered_location} // Set the value prop to the selected option
                        onChange={(selectedOption) => {
                          formik.setFieldValue('Preffered_location', selectedOption);
                        }}
                        placeholder="Preffered Location"
                        className="w-100 mb-2 text-center" 
                        styles={customStyles}
                        isSearchable={true} 
                      
                      />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
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
         
                      <Col xs={6}>
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
                       <Col xs={3}>
                   <Form.Label>Candidate LWD</Form.Label>
                   </Col>
                   <Col xs={9}>
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
                      <Col xs={6}>
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
                      <Col xs={6}>
                      <Form.Control
                          {...formik.getFieldProps('Referral')}
                          type="text"
                          placeholder="Referral Name"
                          className="custom-placeholder-style w-100 mb-2 text-center" 
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          {...formik.getFieldProps('Referral_MobileNumber')}
                          type="tel"
                          placeholder="Referral Mobile Number"
                          className="custom-placeholder-style w-100 mb-2 text-center" 
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={6}>
                      <Form.Select
                        {...formik.getFieldProps('current_offer')}
                        className="custom-placeholder-style w-100 mb-2 text-center"
                        onChange={(e) => {
                          formik.handleChange(e);
                          setAdditionalFieldVisible(e.target.value === 'Yes');
                        }}
                        required
                      >  
                        <option value="">Current offer*</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>
                      </Col>
                      <Col xs={6}>
  {additionalFieldVisible && (
    <>
      <Form.Control
        {...formik.getFieldProps('offer_details')}
        as="textarea"  // Set 'as' prop to 'textarea'
        placeholder="enter the offer details"
        className="custom-placeholder-style w-100 mb-2 text-center"
        required
      />
    </>
  )}
</Col>
                    </Row>
                    <Row>
                    <Col xs={6}>
                    <Form.Control
        {...formik.getFieldProps('Comment')}
        as="textarea"  // Set 'as' prop to 'textarea'
        placeholder="Comment"
        className="custom-placeholder-style w-100 mb-2 text-center"
      />
                      </Col>
                      <Col xs={2}>
                      <Form.Label>Upload Resume:</Form.Label>
                      </Col>
                      <Col xs={4}>
                      <Form.Control
                          onChange={onUpload}
                          type="file"
                          id="Upload_resume"
                          name="Upload_resume"
                          placeholder='Ulpoad resume'
                          className="custom-placeholder-style w-100 mb-2 text-center"
                          required                          
                        />
                      </Col>
                    </Row>
                    <Button type="submit" className="btn btn-success custom-button">
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