import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { updateAdminpostById, getAdmindetailsById, deleteAdminpostById,getClients  } from '../helper/Helper';
import { useParams, useNavigate } from 'react-router-dom';
import convertToBase64 from '../helper/Convert';
import Loader from './Loader';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {jobModeOptions, modeOptions,customStyles,indianStateswithmetropolitanCities } from '../helper/Option';
import './FontText.css';
import ReactSelect from 'react-select'; 
import { getAllTechstack  } from "../helper/Helper";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showServingNoticePeriod, setshowServingNoticePeriod] = useState(false);
  const [options, setOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

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

    fetchUserData();
  }, [userId]);

  const formik = useFormik({
    initialValues: userData || {
      Client_Name: '',
      Open_position: '',
      Notice_peried:'',
      Serving_Notice_Period_Date:'',
      min_Yre_of_exp:[],
      max_Yre_of_exp:[],
      Tech_stack: [],
      Budget: '',
      Location: [],
      Job_Description: '',
      Job_Des: '',
      Job_Mode: [],
      Mode: [],
      status: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values.Job_Description = file || null;

      const updatePromise = updateAdminpostById(userData._id, values);

      try {
        await toast.promise(
          updatePromise,
          {
            loading: 'Updating...',
            success: () => {
              navigate('/searchadminpost');
              return 'User details updated successfully!';
            },
            error: (error) => {
              console.error('Frontend Error:', error);
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
    const fetchOptions = async () => {
      try {
        const optionsData = await getAllTechstack();
        console.log(optionsData); // Log response to check its structure
        if (Array.isArray(optionsData)) {
          const formattedOptions = optionsData.map(option => ({
            label: option.label.charAt(0).toUpperCase() + option.label.slice(1),
            value: option.value.charAt(0).toUpperCase() + option.value.slice(1)
          }));
          setOptions(formattedOptions);
        } else {
          console.error('Response is not an array:', optionsData);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
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
  
    fetchClientNames();
  
    // Cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, []);


  const onUpload = async (e) => {
    const uploadedFile = e.target.files[0];
  
    if (uploadedFile) {
      // Convert the uploaded file to base64
      const fileBase64 = await convertToBase64(uploadedFile);
      setFile(fileBase64);
  
      // Validate with updated file
      formik.setErrors((formik.values, fileBase64));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const onDelete = async () => {
    // Show a confirmation alert before deleting the post
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) {
      return; // If the user clicks "Cancel", do nothing
    }

    try {
      await deleteAdminpostById(userData._id);
      toast.success('Recruitment post deleted successfully!');
      navigate('/searchadminpost');
    } catch (error) {
      console.error('Error deleting recruitment post:', error);
      toast.error('Failed to delete recruitment post.');
    }
  };

 



  return (
    <Container >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
    <Row>
    <Col xs={12} md={12} lg={12} className="text-center py-4">
      <h4 className="text-5xl font-bold">Update Client Requirements..!</h4>
      <span className="py-4 text-xl w-2/3 text-center text-muted"></span>
    </Col>
    <Col xs={12} md={12} lg={12}>
      <Form onSubmit={formik.handleSubmit} className="pt-4">
        <Row>
          <Col xs={6} md={6} lg={6}>
            <h2 className="header-title font-bold mb-3">Ticket Number: {userData.Ticket_no}</h2>
          </Col>
          <Col xs={6} md={6} lg={6}>
            <h4 className="header-title font-bold mb-3">
              Last Update By: {userData.userupdate?.lastupdate.toUpperCase() || 'N/A'}
            </h4>
            {userData.userupdate?.updatedFields && (
              <div>
                <ul>
                  {Object.keys(userData.userupdate.updatedFields).map((field) => (
                    <h4 className="header-title font-bold" key={field}>
                      Updated Fields: {field}
                    </h4>
                  ))}
                </ul>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Status:</label>
          </Col>
          <Col xs={3} md={3} lg={3}>
            <Form.Select {...formik.getFieldProps('status')} required>
              <option value="">status*</option>
              <option value="Open">Open</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Sourcing">Sourcing</option>
              <option value="Customer Closed">Customer Closed</option> 
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </Form.Select>
          </Col>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Client Name:</label> 
          </Col>
          <Col xs={3} md={3} lg={3}>
             <ReactSelect
                          name="Client_Name"
                          options={clientOptions}
                          value={formik.values.Client_Name ? { label: formik.values.Client_Name, value: formik.values.Client_Name } : null}
                          onChange={(selectedOption) => {
                            formik.setFieldValue('Client_Name', selectedOption ? selectedOption.value : '');
                          }}
                          styles={customStyles}
                          isSearchable={true}
                          placeholder="Select Client Name"
                          required
                        />
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Min Year of Experience:</label>
          </Col>
          <Col xs={3} md={3} lg={3}>
          <ReactSelect
                          name="min_Yre_of_exp"
                          value={clientOptions}
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
         
          <Col xs={3} md={3} lg={3}> 
            <label className="bold-text">Max Year of Experience:</label>
          </Col>
          <Col xs={3} md={3} lg={3}>
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
           <br/>
          <Row>
          <Col xs={3} md={3} lg={3}>
          <label className="bold-text">Open position:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
          <Form.Control
              {...formik.getFieldProps('Open_position')}
              type="number"
              placeholder="Open Position*"
              className="w-100 mb-2"
              required
            /> 
          </Col>
          </Row>
       
        <Row>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Tech Stack:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
          <CreatableSelect
                options={options}
                isMulti
                value={formik.values.Tech_stack}
                onChange={(selectedOptions) => {
                  formik.setFieldValue('Tech_stack', selectedOptions);
                }}
                placeholder="Select Tech Stack"
                className="w-100 mb-2 text-center"
                styles={customStyles}
                required
              />
          </Col>
        </Row>
        <Row>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Budget In Lakhs:</label>
          </Col>
          <Col xs={3} md={3} lg={3}>
            <Form.Control
              {...formik.getFieldProps('Budget')}
              type="number"
              placeholder="Budget In Lakhs*"
              className="w-100 mb-2"
              required
            />
          </Col>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Location:</label>
          </Col>
          <Col xs={3} md={3} lg={3}>
          <Select
                        options={indianStateswithmetropolitanCities}
                        value={formik.values.Location} // Set the value prop to the selected option
                        isMulti
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
        <Row>
            <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Job Mode:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
            <Select
              options={jobModeOptions}
              isMulti
              value={formik.values.Job_Mode}
              onChange={(selectedOptions) => {
                formik.setFieldValue('Job_Mode', selectedOptions);
              }}
              placeholder="Job Mode*"
              className="w-100 mb-2"
              styles={customStyles}
              required
            />
          </Col>
        </Row>


        <Row>
            <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Notice peried:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
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
        </Row>
        {showServingNoticePeriod && (
          <>
        <Row>
            <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Serving Notice Period Datee:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
          <Form.Control
                  type="date"
                  {...formik.getFieldProps('Serving_Notice_Period_Date')}
                  className="custom-placeholder-style" // Add any additional styling here
                  required
                />  
          </Col>
        </Row>
        </>
        )}
        <br/>

        <Row>
        <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Mode:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
            <Select
              options={modeOptions}
              isMulti
              value={formik.values.Mode}
              onChange={(selectedOptions) => {
                formik.setFieldValue('Mode', selectedOptions);
              }}
              placeholder="Mode*"
              className="w-100 mb-2"
              styles={customStyles}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3} md={3} lg={3}>
            <label className="bold-text">Job Description:</label>
          </Col>
          <Col xs={9} md={9} lg={9}>
            <Form.Control
              {...formik.getFieldProps('Job_Des')}
              as="textarea"
              placeholder="Job Description*"
              className="w-100 mb-2"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3} md={3} lg={3}>
            <Form.Label className="bold-text">Upload Job Description:</Form.Label>
          </Col>
          <Col xs={9} md={9} lg={9}>
            <Form.Control onChange={onUpload} type="file" id="Upload_resume" name="Upload_resume" />
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <Button type="submit" variant="outline-info" size="lg">
              Update
            </Button>
          </Col>
          <Col >
            <Button variant="outline-danger" size="lg" onClick={onDelete}>
              Delete
            </Button>
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
  </Container>
  );
};

export default UpdatePost;