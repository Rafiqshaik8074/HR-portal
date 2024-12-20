import React, { useState, useEffect } from 'react';
import { getAllUsernames, getRecuterSourcedDetails } from '../helper/Helper'; // Import the API function
import Select from 'react-select';
import { customStyles } from '../helper/Option';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const Recruiterreport = () => {
    const [usernames, setUsernames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [recruiterDetails, setRecruiterDetails] = useState(null);
    const [loading, setLoading] = useState(false); // State for storing fetched details

    useEffect(() => {
        async function fetchallUsernames() {
            try {
                const userNames = await getAllUsernames();
                setUsernames(userNames.map(user => {
                    const username = typeof user === 'object' ? user.username : user;
                    return { value: username, label: username.charAt(0).toUpperCase() + username.slice(1) };
                }));
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        fetchallUsernames();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Call the API function to fetch recruiter-sourced details
            setLoading(true);
            const details = await getRecuterSourcedDetails(selectedUsername.value, fromDate, toDate);
            // Store fetched details in state for rendering
            setRecruiterDetails(details);
        } catch (error) {
            console.error('Error:', error.message);
            // Handle error, show error message to user, etc.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center flex-column">
            <Card className="mt-4 w-75" style={{ minHeight: '400px',marginLeft: '40px'}}>
                <Card.Header className='d-flex justify-content-center'>
                    <h2>Recruiter Report</h2>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formFromDate">
                                <Form.Label>From Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="From Date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formToDate">
                                <Form.Label>To Date</Form.Label>
                                <Form.Control type="date" placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                            </Form.Group>
                        </Row>
                        <Select
                            options={usernames}
                            placeholder="Select Username"
                            className="w-100 mb-2 text-center"
                            styles={customStyles}
                            onChange={(selectedOption) => setSelectedUsername(selectedOption)}
                            value={selectedUsername}
                            required
                        />
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </Form>
                    {/* Display fetched details */}
                    {recruiterDetails && (
                       <div>
                    <h4>Recruiter Name: {recruiterDetails.username.charAt(0).toUpperCase() + recruiterDetails.username.slice(1)}</h4>
                       <h4>Total candidate sourced: {recruiterDetails.totalCandidates}</h4>
                       <h4>Status Counts:</h4>
                       <ul>
                           {Object.entries(recruiterDetails.statusCounts).map(([status, count]) => (
                               <li key={status}>
                                   {status}: {count}
                               </li>
                           ))}
                       </ul>
                   </div>
                    )}
                </Card.Body>
                <Card.Footer className='d-flex justify-content-center text-muted'></Card.Footer>
            </Card>
        </div>
    );
}

export default Recruiterreport;