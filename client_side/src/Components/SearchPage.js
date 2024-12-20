import React, { useState } from 'react';
import { getRecuterSourcedDetails } from '../helper/Helper'; // Import your helper function

const SearchPage = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    username: '',
    fromDate: '',
    toDate: '',
  });

  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    try {
      // Use your helper function to make the API request
      const data = await getRecuterSourcedDetails(searchCriteria);

      if (data.error) {
        setSearchResults({ error: data.error });
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      setSearchResults({ error: "Failed to fetch user details" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>Search User Details</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={searchCriteria.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="fromDate">From Date:</label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          value={searchCriteria.fromDate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="toDate">To Date:</label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          value={searchCriteria.toDate}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
      
      {/* Display search results */}
      {searchResults && (
        <div>
          <h2>Search Results</h2>
          {searchResults.error ? (
            <p>{searchResults.error}</p>
          ) : (
            <div>
              <p>Username: {searchResults.username}</p>
              <p>Total Candidates: {searchResults.statusCounts.total}</p>
              {/* You can display status counts here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;