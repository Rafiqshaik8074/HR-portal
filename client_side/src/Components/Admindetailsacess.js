import React, { useState, useEffect } from "react";
import { Table, Container, Row, Col, Form, Button, Pagination } from "react-bootstrap";
import { getAdminPostbyStatus } from "../helper/Helper";
import { Link } from "react-router-dom";
import Loader from './Loader';
import './FontText.css';


const Admindetailsacess = () => {
  const [allAdminPosts, setAllAdminPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  
  const postsPerPage = 10; // Number of results to display per page

  useEffect(() => {
    fetchAllUserDetails();
  }, []);

  const fetchAllUserDetails = async () => {
    try {
      const response = await getAdminPostbyStatus();
      const sortedResponse = response.sort((a, b) => b.Ticket_no - a.Ticket_no);
      setAllAdminPosts(sortedResponse);
      setSearchResult(sortedResponse);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all user details:", error);
    }
  };

  const handleTicketSearch = () => {
    if (ticketSearchTerm === "") {
      setSearchResult(allAdminPosts);
    } else {
      const filteredResults = allAdminPosts.filter(
        user => user.Ticket_no.toString().includes(ticketSearchTerm)
      );
      setSearchResult(filteredResults);
    }
    setCurrentPage(1);
  };

  const handleSearchInputChange = event => {
    const searchTerm = event.target.value;
    setTicketSearchTerm(searchTerm);
    if (searchTerm === "") {
      setSearchResult(allAdminPosts);
    }
  };
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleTicketSearch(); // Call the existing search function
    setCurrentPage(1);
  };

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
  };
   
  
  const sortedSearchResult = Array.isArray(searchResult)
    ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
    : [];

  const indexOfLastResult = currentPage * postsPerPage;
  const indexOfFirstResult = indexOfLastResult - postsPerPage;
  const resultsToDisplay = sortedSearchResult.slice(indexOfFirstResult, indexOfLastResult);

  const pageNumbers = Array.from({ length: Math.ceil(sortedSearchResult.length / postsPerPage) }, (_, i) => i + 1);

  if (isLoading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="pt-5 custom-font">
    <div style={{ maxWidth: '1500px', margin: '0 auto' }}> {/* Add custom div with max-width */}
      <Container fluid >
    
          <Row className="mt-3"  style={{marginLeft: '10px' }}> 
            <Col md={12}>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group>
                  <Form.Label><h6>Search by Requirement Number</h6></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Req.No"
                    value={ticketSearchTerm}
                    onChange={handleSearchInputChange}
                    style={{ maxWidth: '200px', }}
                  />
                </Form.Group>
            
                <Button variant="outline-info" onClick={handleTicketSearch} className="mt-2">
                  Search
                </Button>
           
              </Form>
            </Col>
          </Row>
      
        {resultsToDisplay.length > 0 ? (
          <Row className="mt-2">
            <Col md={12} style={{ marginLeft: '30px' }}>
            <h3 className="header-title">Aroha Technologies Client Requirements</h3>
            <Table className="custom-font table-responsive-lg"  bordered
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 12px",
                    tableLayout: "auto",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px #ccc",
                    marginBottom: "20px",
                    padding: "10px",
                    marginTop: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    color: "#000",
                  }}>
                <thead style={{ backgroundColor: "#ffc0cb" }}>
                <tr>
                  <th>Date</th>                
                    <th>Req.No</th>
                    <th>Client</th>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Status</th>                                    
                    <th>Details</th>
                    <th>Resumes</th>                                     
                  </tr> 
                </thead>  
                <tbody >
                  {resultsToDisplay.map((user) => (
                    
                     <tr key={user._id}>
                      
                     <td >{new Date(user.date).toLocaleDateString("en-GB")}</td>                  
                     <td>{user.Ticket_no}</td>
                     <td>{user.Client_Name}</td>
                     <td>{user.Tech_stack.map(tech => tech.value).join(', ')}</td>
                     <td>{user.Location.map(Location => Location.value).join(', ')}</td>
                     <td>{user.status}</td>                   
                     <td>
                     <Link to={`/viewadminpost/${user._id}`}>
                           <Button variant="outline-dark" size="md">View</Button>
                         </Link>
                     </td>  
                     <td>
                      
                      <Link to={`/recutepost/${user._id}`}>
                            <Button variant="outline-dark" size="md">Upload</Button>
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
         <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
  {pageNumbers.map((number) => {
    if (Math.abs(number - currentPage) <= 2 || number === 1 || number === pageNumbers.length) {
      return (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
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

export default Admindetailsacess;



// import React, { useState, useEffect } from "react";
// import { Table, Container, Row, Col, Form, Button, Pagination } from "react-bootstrap";
// import { getAdminPostbyStatus } from "../helper/Helper";
// import { Link } from "react-router-dom";
// import Loader from "./Loader";

// const Admindetailsacess = () => {
//   const [allAdminPosts, setAllAdminPosts] = useState([]);
//   const [searchResult, setSearchResult] = useState([]);
//   const [ticketSearchTerm, setTicketSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   const postsPerPage = 10; // Number of results to display per page

//   useEffect(() => {
//     fetchAllUserDetails();
//   }, []);

//   const fetchAllUserDetails = async () => {
//     try {
//       const response = await getAdminPostbyStatus();
//       const sortedResponse = response.sort((a, b) => b.Ticket_no - a.Ticket_no);
//       setAllAdminPosts(sortedResponse);
//       setSearchResult(sortedResponse);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching all user details:", error);
//     }
//   };

//   const handleTicketSearch = () => {
//     if (ticketSearchTerm === "") {
//       setSearchResult(allAdminPosts);
//     } else {
//       const filteredResults = allAdminPosts.filter(
//         user => user.Ticket_no.toString().includes(ticketSearchTerm)
//       );
//       setSearchResult(filteredResults);
//     }
//     setCurrentPage(1);
//   };

//   const handleSearchInputChange = (event) => {
//     const searchTerm = event.target.value;
//     setTicketSearchTerm(searchTerm);
//     if (searchTerm === "") {
//       setSearchResult(allAdminPosts);
//     }
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault(); // Prevent the default form submission behavior
//     handleTicketSearch(); // Call the existing search function
//     setCurrentPage(1);
//   };

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const sortedSearchResult = Array.isArray(searchResult)
//     ? [...searchResult].sort((a, b) => b.Ticket_no - a.Ticket_no)
//     : [];

//   const indexOfLastResult = currentPage * postsPerPage;
//   const indexOfFirstResult = indexOfLastResult - postsPerPage;
//   const resultsToDisplay = sortedSearchResult.slice(
//     indexOfFirstResult,
//     indexOfLastResult
//   );

//   const pageNumbers = Array.from(
//     { length: Math.ceil(sortedSearchResult.length / postsPerPage) },
//     (_, i) => i + 1
//   );

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <div className="pt-5 custom-font">
//       <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
//         {/* Add custom div with max-width */}
//         <Container fluid>
//           <Row className="mt-3">
//             <Col xs={12} md={6}>
//               <Form onSubmit={handleFormSubmit}>
//                 <Form.Group>
//                   <Form.Label>
//                     <h6>Search by Requirement Number</h6>
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Req.No"
//                     value={ticketSearchTerm}
//                     onChange={handleSearchInputChange}
//                     style={{ maxWidth: "200px" }}
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="outline-info"
//                   onClick={handleTicketSearch}
//                   className="mt-2"
//                 >
//                   Search
//                 </Button>
//               </Form>
//             </Col>
//           </Row>

//           {resultsToDisplay.length > 0 ? (
//             <Row className="mt-2">
//               <Col md={12}>
//                 <Table
//                   className="custom-font table-responsive-lg"
//                   bordered
//                   style={{
//                     borderCollapse: "separate",
//                     borderSpacing: "0 12px",
//                     tableLayout: "auto",
//                     width: "100%",
//                   }}
//                 >
//                   <thead style={{ backgroundColor: "#ffc0cb" }}>
//                     <tr>
//                       <th>Date</th>
//                       <th>Req.No</th>
//                       <th>Client</th>
//                       <th>Job Title</th>
//                       <th>Location</th>
//                       <th>Status</th>
//                       <th>Details</th>
//                       <th>Resumes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {resultsToDisplay.map((user) => (
//                       <tr key={user._id}>
                        // <td
                        //   style={{
                        //     backgroundColor:
                        //       user.status === "Open" ? "#ff69b4" : "#add8e6",
                        //     color: "#fff",
                        //   }}
                        // >
                        //   {new Date(user.date).toLocaleDateString("en-GB")}
                        // </td>
//                         <td>{user.Ticket_no}</td>
//                         <td>{user.Client_Name}</td>
//                         <td>{user.Tech_stack.map(tech => tech.value).join(', ')}</td>
//                         <td>{user.Location.map(Location => Location.value)}</td>
//                         <td>{user.status}</td>
//                         <td>
//                           <Link to={`/viewadminpost/${user._id}`}>
//                             <Button variant="outline-dark" size="md">
//                               View
//                             </Button>
//                           </Link>
//                         </td>
//                         <td>
//                           <Link to={`/recutepost/${user._id}`}>
//                             <Button variant="outline-dark" size="md">
//                               Upload
//                             </Button>
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
//           <Pagination
//             style={{
//               marginTop: "10px",
//               justifyContent: "center",
//               display: "flex",
//             }}
//           >
//             {pageNumbers.map((number) => {
//               if (
//                 number <= currentPage + 3 &&
//                 number >= currentPage - 3 &&
//                 number > 0
//               ) {
//                 return (
//                   <Pagination.Item
//                     key={number}
//                     active={number === currentPage}
//                     onClick={() => paginate(number)}
//                     style={{
//                       border: "1px solid #007bff",
//                       margin: "2px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {number}
//                   </Pagination.Item>
//                 );
//               } else if (Math.abs(number - currentPage) === 3) {
//                 return <Pagination.Ellipsis key={number + "ellipsis"} disabled />;
//               }
//               return null;
//             })}
//           </Pagination>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default Admindetailsacess;