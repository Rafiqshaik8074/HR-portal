import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Pagination,Button} from 'react-bootstrap';
import { getCountsForAllTickets } from "../helper/Helper";
import Loader from './Loader';
import { CSVLink } from 'react-csv';


function Adminagetdetails() {
  const [counts, setCounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const resultsPerPage = 10;
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCountsForAllTickets();
        
        if (Array.isArray(data)) {
          // Handle the array data
          data.sort((a, b) => b.Ticket_no - a.Ticket_no);
          setCounts(data);
        } else if (data && data.message === 'No data found') {
          setCounts([]);
        } else {
          // Handle other cases where the data is not as expected
          console.error("Data is not an array or has an unexpected format");
          setCounts([]);
        }

        setIsLoading(false);
      } catch (error) {
        // Log the error to the console
        console.error(error.message);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);


  useEffect(() => {
    const generateCsvData = () => {
      const csvDataArray = counts.map((count) => [
        count.Ticket_no,
        new Date(count.date).toLocaleDateString("en-GB"),
        count.Client_Name,
        Array.isArray(count.Tech_stack) ? count.Tech_stack.map(tech => tech.value).join(', ') : '',
        count.status,
        count.totalnumber_of_candidates,
        count.rejectedbyaroha,
        count.submittedtoclient,
        count.rejectededbyclient,
        count.selectedbyclient
      ]);
    
      if (csvDataArray.length > 0) {
        const headers = [
          "Req.No",
          "Date",
          "Client",
          "Job Title",
          "Status",
          "Total Sourced",
          "Aroha Rejected",
          "Submitted",
          "Client Rejected",
          "Client Selected"
        ];
    
        setCsvData([headers, ...csvDataArray]);
      } else {
        setCsvData([]); // Make sure to set csvData to an empty array if there's no data
      }
    };
  
    generateCsvData();
  }, [counts]);
  const indexOfLastResult = currentPage * resultsPerPage; 
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentRecords = counts.slice(indexOfFirstResult, indexOfLastResult);

  const pageNumbers = Array.from({ length: Math.ceil(counts.length / resultsPerPage) }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <Row className="mt-2">
        <Col md={12} style={{ marginLeft: '40px' }}> 
          <h2 className="header-title ml-5">Aroha Current Opening's- Dashboard</h2>
          <CSVLink data={csvData} filename={'Client_details.csv'}>
        <Button className="mt-5 mr-2" variant="outline-success">
          Export to CSV
        </Button>
      </CSVLink>
          {counts.length > 0 ? (
            <>
                <Table className="custom-font table-responsive-lg"  bordered
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 12px",
                    tableLayout: "auto",
                    width: "70%",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px #ccc",
                    marginBottom: "20px",
                    marginTop: "20px",
                    color: "#000",
                  }}>
                {/* Table headers */}
                <thead>
                  <tr>
                    <th>Req.No</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Total Sourced</th>
                    <th>Aroha Rejected</th>
                    <th>Submitted</th>
                    <th>Client Rejected</th>
                    <th>Client Selected</th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {currentRecords.map((count) => (
                    <tr key={count.Ticket_no}>
                      <td>{count.Ticket_no}</td>
                      <td>{new Date(count.date).toLocaleDateString("en-GB")}</td>
                      <td>{count.Client_Name}</td>
                      <td>
                      {Array.isArray(count.Tech_stack)
                        ? count.Tech_stack.map(tech => tech.value).join(', ')
                        : ''}
                    </td> 
                      <td>{count.status}</td>
                      <td>{count.totalnumber_of_candidates}</td>
                      <td>{count.rejectedbyaroha}</td>
                      <td>{count.submittedtoclient}</td>
                      <td>{count.rejectededbyclient}</td>
                      <td>{count.selectedbyclient}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* Pagination */}
              <Pagination style={{ marginTop: '10px', justifyContent: 'center' }}>
                {pageNumbers.map((number) => (
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
                ))}
              </Pagination>
            </>
          ) : (
            <Row>
            <Col md={12}> 
              <p className="custom-text">No results found.</p>
            </Col>
          </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Adminagetdetails;