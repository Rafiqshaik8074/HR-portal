import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import { FunnelChart, Funnel, Tooltip, Cell } from 'recharts';
import { saveAs } from 'file-saver';
import { pdf, Document, Page, Text, Image, StyleSheet, View } from '@react-pdf/renderer';
import { getCandidateCounts } from '../helper/Helper'; // Adjust the path to helper.js
import { toPng } from 'html-to-image';
import Loader from './Loader';
import './FontText.css';

function CountsByTicketAndStatus() {
  const [candidateCounts, setCandidateCounts] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputTicketNumber, setInputTicketNumber] = useState('');

  const funnelChartRef = useRef(null);

  const fetchCandidateCounts = async (ticketNumber) => {
    setError('');
    setLoading(true); // Set loading state to true while fetching data

    try {
      const counts = await getCandidateCounts(ticketNumber);
      if (counts.error) {
        setError(counts.error);
        setCandidateCounts(null);
      } else {
        setCandidateCounts(counts);
      }
    } catch (error) {
      setError('Failed to fetch candidate counts');
      setCandidateCounts(null);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete
    }
  };

  const initialValues = {
    ticketNumber: '',
  };

  const handleChange = (event) => {
    setInputTicketNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCandidateCounts(inputTicketNumber);
  };

  const funnelData = [
    { name: 'Total Candidates', value: candidateCounts?.totalnumber_of_candidates || 0 },
    { name: 'Rejected by Aroha', value: candidateCounts?.rejectedbyaroha || 0 },
    { name: 'Selected by Client', value: candidateCounts?.selectedbyclient || 0 },
    { name: 'Rejected by Client', value: candidateCounts?.rejectededbyclient || 0 },
    { name: 'Feedback Pending', value: candidateCounts?.FeedBack || 0 },
  ];

  const funnelColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
  const downloadPDF = async () => {
    const funnelImage = await toPng(funnelChartRef.current);

    const MyDocument = ({ funnelData, candidateCounts }) => (
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Report</Text>
            <br />
            <Text style={styles.subtitle}>Ticket Number: {candidateCounts.Ticket_no}</Text>
            <Text style={styles.subtitle}>Client Name: {candidateCounts.Client_Name}</Text>
            <Text style={styles.subtitle}>Tech stack:{candidateCounts.Tech_stack.map(tech => tech.value).join(', ')}</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.headerCell}>Metrics</Text>
              <Text style={styles.headerCell}>values</Text>
            </View>
            {funnelData.map((entry, index) => (
              entry.value > 0 && (
                <View key={`pdf-funnel-${index}`} style={styles.tableRow}>
                  <Text style={{ ...styles.contentCell, color: funnelColors[index % funnelColors.length] }}>
                    {entry.name}
                  </Text>
                  <Text style={styles.contentCell}>
                    {entry.value}
                  </Text>
                </View>
              )
            ))}
          </View>
          <Image src={funnelImage} style={styles.image} />
        </Page>
      </Document>
    );

    const styles = StyleSheet.create({ 
      page: {
        padding: 30,
      },
      header: {
        textAlign: 'center',
        marginBottom: 20,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom:5
      },
      subtitle: {
        fontSize: 14,
        marginBottom: 5,
        paddingTop:4
      },
      tableContainer: {
        marginBottom: 20,
      },
      tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
        marginBottom: 5,
      },
      headerCell: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      contentCell: {
        fontSize: 12,
      },
      image: {
        width: '100%',
        height: 200,
      },
    });

    const pdfBlob = await pdf(<MyDocument funnelData={funnelData} candidateCounts={candidateCounts} />).toBlob();
    saveAs(pdfBlob, `Report${candidateCounts.Ticket_no}.pdf`);
  };

  const sortedFunnelData = [...funnelData].sort((a, b) => b.value - a.value);

  return (
    <Container className="mt-5">
      <h1 className="text-center justify-content-center header-title pt-5">Report</h1>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          {/* Display loader while loading data */}
          {loading ? (
            <div className="text-center">
             
             <Loader/>
            </div>
          ) : (
            // Display form, error messages, and candidate count data when not loading
            <div>
              <Formik initialValues={initialValues}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="ticketNumber">
                    <Form.Label>
                      <h2 className="header-title">Enter Requirement Number</h2>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="ticketNumber"
                      value={inputTicketNumber}
                      onChange={handleChange}
                      style={{ maxWidth: '200px' }}
                      placeholder="Enter Req.No"
                    />
                  </Form.Group>
                  <br />
                  <Button variant="dark" type="submit">
                    Get Details
                  </Button>
                </Form>
              </Formik>
              <br />

              {error && <p className="text-danger">{error}</p>}

              {candidateCounts && (
                <div>
                  {/* Display candidate count table */}
                  <Row className="justify-content-center">
                    <Col xs={12} md={12} className="pt-5">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Details</th>
                            <th>values</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Ticket Number</td>
                            <td>{candidateCounts.Ticket_no}</td>
                          </tr>
                          <tr>
                            <td>Client Name</td>
                            <td>{candidateCounts.Client_Name}</td>
                          </tr>
                          <tr>
                            <td>Tech stack</td>
                            {candidateCounts.Tech_stack.map(tech => tech.value).join(', ')}
                          </tr>
                          <tr>
                            <td>Total Candidates</td>
                            <td>{candidateCounts.totalnumber_of_candidates}</td>
                          </tr>
                          <tr>
                            <td>Rejected by Aroha</td>
                            <td>{candidateCounts.rejectedbyaroha}</td>
                          </tr>
                          <tr>
                            <td>Rejected by Client</td>
                            <td>{candidateCounts.rejectededbyclient}</td>
                          </tr>
                          <tr>
                            <td>Feedback</td>
                            <td>{candidateCounts.FeedBack}</td>
                          </tr>
                          <tr>
                            <td>Selected by Client</td>
                            <td>{candidateCounts.selectedbyclient}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Button variant="warning" onClick={downloadPDF}>
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          )}
        </Col>
        <Col xs={12} md={6} className="pt-5">
          <div className="d-flex flex-row align-items-center">
            <div ref={funnelChartRef}>
              <FunnelChart width={400} height={300}>
                <Tooltip />
                <Funnel dataKey="value" data={sortedFunnelData}>
                  {sortedFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                  ))}
                </Funnel>
              </FunnelChart>
            </div>
            <div className="ml-4">
              {funnelData.map((entry, index) => (
                entry.value > 0 && (
                  <div key={index} className="text-center">
                    <span style={{ color: funnelColors[index % funnelColors.length] }}>
                      {`${entry.name}: ${entry.value}`}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CountsByTicketAndStatus;

