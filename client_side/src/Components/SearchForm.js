import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Table, Container, Row, Col, Card, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CSVLink } from 'react-csv';
import Loader from './Loader';
import './FontText.css';
import Select from 'react-select';
import { customStyles } from '../helper/Option';
import { getAllUserDetails, getUserDetails,getAllDomains } from "../helper/Helper";

const SearchForm = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const resultsPerPage = 10;
  const [options, setOptions] = useState([]);

  useEffect(() => {
     // Check if there's search result stored in sessionStorage
    const storedSearchResult = sessionStorage.getItem('searchResult');
    if (storedSearchResult) {
      setSearchResult(JSON.parse(storedSearchResult));
      setIsLoading(false);
    } else {
      fetchAllAdminPostDetails();
    }
  }, []);

  const fetchAllAdminPostDetails = async () => {
    try {
      const response = await getAllUserDetails();
      setSearchResult(response);
      setIsLoading(false);
      sessionStorage.setItem('searchResult', JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching admin post details:", error);
    }
  };

  useEffect(() => {
    generateCsvData(searchResult);
  }, [searchResult]);

  const generateCsvData = (data) => {
    const csvDataArray = data.map((user) => [
      user.CandidateName || '',
      user.MobileNumber || '',
      user.Email || '',
      user.Yre_of_expe ? user.Yre_of_expe.map(tech => tech.value).join(', ') : '',
      user.Relevent_Yre_of_exp ? user.Relevent_Yre_of_exp.map(tech => tech.value).join(', ') : '',
      user.CTC || '',
      user.ECTC || '',
      user.Notice_peried ? `${user.Notice_peried} ${user.Serving_Notice_Period_Date ? `Candidate LWD: ${new Date(user.Serving_Notice_Period_Date).toLocaleDateString('en-IN')}` : ''}` : '',
      user.Current_location ? user.Current_location.map((tech) => tech.value).join(', ') : '',
      user.Status || '',
      user.Comment || ''
    ]);

    const headers = [
      'Name',
      'Mobile',
      'Email',
      'Years Of Experience',
      'Relevant Years Of Experience',
      'CTC',
      'ECTC',
      'Notice Period',
      'Location',
      'Status',
      'Comment'
    ];

    setCsvData([headers, ...csvDataArray]);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const optionsData = await getAllDomains();
        if (Array.isArray(optionsData)) {
          setOptions(optionsData.map(option => ({ label: option.label, value: option.value })));
        } else {
          console.error('Response is not an array:', optionsData);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();

    return () => {
      // Cleanup code here if needed
    };
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await getUserDetails(values);
      setSearchResult(response);
      setCurrentPage(1);
      generateCsvData(response);
      sessionStorage.setItem('searchResult', JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching admin post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedSearchResult = Array.isArray(searchResult)
    ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
    : [];

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const resultsToDisplay = sortedSearchResult.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const pageNumbers = Array.from({ length: Math.ceil(sortedSearchResult.length / resultsPerPage) }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const initialValues = {
    Ticket_no: "",
    CandidateName: "",
    MobileNumber: "",
    Notice_peried: "",
    Domain: "",
    fromDate: "",
    toDate: "",
    minYre: "",
    maxYre: "",
    minECTC: "",
    maxECTC: ""
  };

  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="pt-5 custom-font">
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <Container fluid className="pt-5">
          <Card style={{ marginLeft: "150px" }} className="mt-2 pt-2">
            <Row>
              <Col sm={12} md={12} className="text-center pt-5">
                <Card.Header>
                  <h2 className="header-title text-center" style={{ textDecoration: 'underline' }}>
                    Search Candidate Details
                  </h2>
                </Card.Header>
                <Card.Body>
              
                  <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
                    {formik => (
                      <Form>
                        <Row>
                          <Col md={4}>
                            <Field
                              type="number"
                              placeholder="Enter Req.Number"
                              name="Ticket_no"
                              className="form-control"
                            />
                          </Col>
                          <Col md={4}>
                            <Field
                              type="text"
                              placeholder="Enter Candidate Name"
                              name="CandidateName"
                              className="form-control"
                            />
                          </Col>
                          <Col md={4}>
                            <Field
                              type="tel"
                              placeholder="Enter Mobile Number"
                              name="MobileNumber"
                              className="form-control"
                            />
                          </Col>
                        </Row>
                        <Row className="pt-5">
                          <Col md={6}>
                            <Field
                              list="data"
                              placeholder="Enter Notice Period"
                              name="Notice_peried"
                              className="form-control"
                            />
                            <datalist id="data">
                              <option>one month</option>
                              <option>two months</option>
                              <option>three months</option>
                              <option>four months</option>
                            </datalist>
                          </Col>
                          <Col md={6}>
                          <Select
                            options={options}
                            isMulti
                            value={formik.values.Domain} // Set the value prop to the selected options
                            onChange={(selectedOptions) => {
                              formik.setFieldValue('Domain', selectedOptions);
                            }}
                            placeholder="Domain/Skill Set*"
                            className="w-100 mb-2"
                            styles={customStyles}                            
                          />  
                          </Col>
                        </Row>
                        <Row className="pt-5">                    
                        <Col md={6}>
                          <Field
                            type="number"
                            placeholder="Enter Min Experience"
                            name="minYre"
                            className="form-control"
                          />
                        </Col>
                    
                        <Col md={6}>
                          <Field
                            type="number"
                            placeholder="Enter Max Experience"
                            name="maxYre"
                            className="form-control"
                          />
                        </Col>
                      </Row>


                      <Row className="pt-5">                    
                        <Col md={6}>
                          <Field
                            type="number"
                            placeholder="Enter Min ECTC In Lakh"
                            name="minECTC"
                            className="form-control"
                          />
                        </Col>
                    
                        <Col md={6}>
                          <Field
                            type="number"
                            placeholder="Enter Max ECTC In Lakh"
                            name="maxECTC"
                            className="form-control"
                          />
                        </Col>
                      </Row>


                        <Row className="pt-5">
                          <Col md={2}>
                            <label>From Date</label>
                          </Col>
                          <Col md={4}>
                            <Field type="date" name="fromDate" className="form-control" />
                          </Col>
                          <Col md={2}>
                            <label>To Date</label>
                          </Col>
                          <Col md={4}>
                            <Field type="date" name="toDate" className="form-control" />
                          </Col>
                        </Row>
                        <Button className="mt-5" variant="outline-info" type="submit" disabled={loading}>
                        {loading ? 'searching...' : 'Search'}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Col>
            </Row>
          </Card>
          {resultsToDisplay.length > 0 ? (
            <Row className="mt-5">
              <Col md={12} style={{ marginLeft: "50px" }}>
                <h3 className="text-center pt-5" style={{ textDecoration: "underline" }}>Candidate Details</h3>
                <CSVLink data={csvData} filename={'candidate_details.csv'}>
        <Button className="mt-5 mr-2" variant="outline-success">
          Export to CSV
        </Button>
      </CSVLink>
                <Table striped  hover responsive style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>CTC</th>
                      <th>ECTC</th>
                      <th>Notice Period</th>
                      <th>Location</th>
                      <th>Profile</th>
                      <th>View</th>
                     
                     
                    </tr>
                  </thead>
                  <tbody>
                    {resultsToDisplay.map((user) => (
                      <tr key={user._id}>
                        <td>{user.CandidateName}</td>
                        <td>{user.MobileNumber}</td>
                        <td>{user.Email}</td>
                        <td>{user.CTC}</td>
                        <td>{user.ECTC}</td>
                        <td>{user.Notice_peried}</td>
                        <td>{user.Current_location.map(tech => tech.value).join(', ')}</td>
                        <td>
                          <Link to={`/updatepost/${user._id}`}>
                            <Button variant="outline-warning">Update</Button>
                          </Link>
                        </td>
                        <td>
                     <Link to={`/viewcandidatedetails/${user._id}`}>
                           <Button variant="outline-info" size="md">View</Button>
                         </Link>
                     </td>       
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={12}>
                <p>No results found.</p>
              </Col>
            </Row>
          )}
          {/* Display pagination */}
          <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
            {pageNumbers.map((number) => {
              if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
                return (
                  <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                    style={{
                      border: '1px solid #007bff',
                      margin: '2px',
                      cursor: 'pointer',
                    }}
                  >
                    {number}
                  </Pagination.Item>
                );
              } else if (Math.abs(number - currentPage) === 3) {
                return <Pagination.Ellipsis key={number + 'ellipsis'} disabled />;
              }
              return null;
            })}
          </Pagination>
        </Container>
      </div>
    </div>
  );
};

export default SearchForm;


// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import { Button, Table, Container, Row, Col, Card, Pagination } from "react-bootstrap";
// import { getUserDetails, getAllUserDetails } from "../helper/Helper";
// import { Link } from "react-router-dom";
// import Loader from './Loader';
// import { downloadResume } from '../helper/Convert';
// import Select from 'react-select';
// import { techStackOptions, customStyles } from '../helper/Option';

// const SearchForm = () => {
  

//   const [searchResult, setSearchResult] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const resultsPerPage = 10;

//   useEffect(() => {
//     // Check if search results are stored in local storage
//     const storedResults = JSON.parse(localStorage.getItem("searchResults"));
//     if (storedResults) {
//       setSearchResult(storedResults);
//       setIsLoading(false);
//     } else {
//       fetchAllAdminPostDetails();
//     }
//   }, []);

//   const fetchAllAdminPostDetails = async () => {
//     try {
//       const response = await getAllUserDetails();
//       setSearchResult(response);
//       setIsLoading(false);
//       // Store the search results in local storage
//       localStorage.setItem("searchResults", JSON.stringify(response));
//     } catch (error) {
//       console.error("Error fetching admin post details:", error);
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const response = await getUserDetails(values);
//       setSearchResult(response);
//       setCurrentPage(1);
//       // Store the search results in local storage
//       localStorage.setItem("searchResults", JSON.stringify(response));
//     } catch (error) {
//       console.error("Error fetching admin post details:", error);
//     }
//   };
















// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import { Button, Table, Container, Row, Col, Card, Pagination } from "react-bootstrap";
// import { getAllUserDetails, getUserDetails } from "../helper/Helper";
// import { Link } from "react-router-dom";
// import Loader from './Loader';
// import './FontText.css';
// import Select from 'react-select';
// import { techStackOptions, customStyles } from '../helper/Option';




// const SearchForm = () => {
//   const [searchResult, setSearchResult] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const resultsPerPage = 10;

//   useEffect(() => {
//     fetchAllAdminPostDetails();
//   }, []);

//   const fetchAllAdminPostDetails = async () => {
//     try {
//       const response = await getAllUserDetails();
       
//       setSearchResult(response);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching admin post details:", error);
//     }
//   };

//   const handleSubmit = async (values, formik) => {
//     try {
//       const response = await getUserDetails(values);
//       setSearchResult(response);
//       setCurrentPage(1);
//     } catch (error) {
//       console.error("Error fetching admin post details:", error);
//     }
//   };

//   const sortedSearchResult = Array.isArray(searchResult)
//     ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
//     : [];

//   const indexOfLastResult = currentPage * resultsPerPage;
//   const indexOfFirstResult = indexOfLastResult - resultsPerPage;
//   const resultsToDisplay = sortedSearchResult.slice(
//     indexOfFirstResult,
//     indexOfLastResult
//   );

//   const pageNumbers = Array.from({ length: Math.ceil(sortedSearchResult.length / resultsPerPage) }, (_, i) => i + 1);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const initialValues = {
//     Ticket_no: "",
//     CandidateName: "",
//     MobileNumber: "",
//     Notice_peried: "",
//     Domain: "",
//     fromDate: "",
//     toDate: "",
//     minYre: "",
//     maxYre: "", 
//   };

//   if (isLoading) {
//     return (
//       <Loader />
//     );
//   }

//   return (
//     <div className="pt-5 custom-font">
//       <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
//         <Container fluid className="pt-5">
//           <Card style={{ marginLeft: "150px" }} className="mt-2 pt-2">
//             <Row>
//               <Col sm={12} md={12} className="text-center pt-5">
//                 <Card.Header>
//                   <h2 className="header-title text-center" style={{ textDecoration: 'underline' }}>
//                     Search Candidate Details
//                   </h2>
//                 </Card.Header>
//                 <Card.Body>
//                   <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
//                     {formik => (
//                       <Form>
//                         <Row>
//                           <Col md={4}>
//                             <Field
//                               type="number"
//                               placeholder="Enter Req.Number"
//                               name="Ticket_no"
//                               className="form-control"
//                             />
//                           </Col>
//                           <Col md={4}>
//                             <Field
//                               type="text"
//                               placeholder="Enter Candidate Name"
//                               name="CandidateName"
//                               className="form-control"
//                             />
//                           </Col>
//                           <Col md={4}>
//                             <Field
//                               type="tel"
//                               placeholder="Enter Mobile Number"
//                               name="MobileNumber"
//                               className="form-control"
//                             />
//                           </Col>
//                         </Row>
//                         <Row className="pt-5">
//                           <Col md={6}>
//                             <Field
//                               list="data"
//                               placeholder="Enter Notice Period"
//                               name="Notice_peried"
//                               className="form-control"
//                             />
//                             <datalist id="data">
//                               <option>one month</option>
//                               <option>two months</option>
//                               <option>three months</option>
//                               <option>four months</option>
//                             </datalist>
//                           </Col>
//                           <Col md={6}>
//                           <Select
//                             options={techStackOptions}
//                             isMulti
//                             value={formik.values.Domain} // Set the value prop to the selected options
//                             onChange={(selectedOptions) => {
//                               formik.setFieldValue('Domain', selectedOptions);
//                             }}
//                             placeholder="Domain/Skill Set*"
//                             className="w-100 mb-2"
//                             styles={customStyles}                            
//                           />  
//                           </Col>
//                         </Row>
//                         <Row className="pt-5">                    
//                         <Col md={6}>
//                           <Field
//                             type="number"
//                             placeholder="Enter Min Experience"
//                             name="minYre"
//                             className="form-control"
//                           />
//                         </Col>
                    
//                         <Col md={6}>
//                           <Field
//                             type="number"
//                             placeholder="Enter Max Experience"
//                             name="maxYre"
//                             className="form-control"
//                           />
//                         </Col>
//                       </Row>
//                         <Row className="pt-5">
//                           <Col md={2}>
//                             <label>From Date</label>
//                           </Col>
//                           <Col md={4}>
//                             <Field type="date" name="fromDate" className="form-control" />
//                           </Col>
//                           <Col md={2}>
//                             <label>To Date</label>
//                           </Col>
//                           <Col md={4}>
//                             <Field type="date" name="toDate" className="form-control" />
//                           </Col>
//                         </Row>
//                         <Button className="mt-5" variant="outline-info" type="submit">
//                           Search
//                         </Button>
//                       </Form>
//                     )}
//                   </Formik>
//                 </Card.Body>
//               </Col>
//             </Row>
//           </Card>
//           {resultsToDisplay.length > 0 ? (
//             <Row className="mt-5">
//               <Col md={12} style={{ marginLeft: "50px" }}>
//                 <h3 className="text-center pt-5" style={{ textDecoration: "underline" }}>Candidate Details</h3>
//                 <Table striped  hover responsive style={{ marginTop: '20px' }}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Mobile</th>
//                       <th>Email</th>
//                       <th>CTC</th>
//                       <th>ECTC</th>
//                       <th>Notice Period</th>
//                       <th>Location</th>
//                       <th>Status</th>
//                       <th>view</th>
                     
//                       <th>Profile</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {resultsToDisplay.map((user) => (
//                       <tr key={user._id}>
//                         <td>{user.CandidateName}</td>
//                         <td>{user.MobileNumber}</td>
//                         <td>{user.Email}</td>
//                         <td>{user.CTC}</td>
//                         <td>{user.ECTC}</td>
//                         <td>{user.Notice_peried}</td>
//                         <td>{user.Current_location.map(tech => tech.value).join(', ')}</td>
//                         <td>{user.Status}</td>
//                         <td>
//                      <Link to={`/viewcandidatedetails/${user._id}`}>
//                            <Button variant="outline-info" size="md">View</Button>
//                          </Link>
//                      </td> 
//                         <td>
//                           <Link to={`/updatepost/${user._id}`}>
//                             <Button variant="outline-warning">Update</Button>
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>
//           ) : (
//             <Row>
//               <Col md={12}>
//                 <p>No results found.</p>
//               </Col>
//             </Row>
//           )}
//           {/* Display pagination */}
//           <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
//             {pageNumbers.map((number) => {
//               if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
//                 return (
//                   <Pagination.Item
//                     key={number}
//                     active={number === currentPage}
//                     onClick={() => handlePageChange(number)}
//                     style={{
//                       border: '1px solid #007bff',
//                       margin: '2px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     {number}
//                   </Pagination.Item>
//                 );
//               } else if (Math.abs(number - currentPage) === 3) {
//                 return <Pagination.Ellipsis key={number + 'ellipsis'} disabled />;
//               }
//               return null;
//             })}
//           </Pagination>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default SearchForm;