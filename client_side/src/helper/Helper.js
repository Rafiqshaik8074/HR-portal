import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// ** To get username from Token
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot Find Token");
  let decode = jwt_decode(token);
  return decode;
}

// Aurthenticate function
// export async function authenticate(username) {
//   try {
//     // return await axios.post("/api/aurthenticate", { username });
//     return await axios.post("http://localhost:8765/api/aurthenticate", { username });
//   } catch (error) {
//     return { error: "Username doesn't exist" };
//   }
// }


export async function authenticate(email) {
  try {
    // return await axios.post("/api/aurthenticate", { email });
    return await axios.post("http://localhost:8765/api/aurthenticate", { email });
  } catch (error) {
    return { error: "User doesn't exist" };
  }
}


// Get user details
export async function getUser(email) {
  try {
    // const { data } = await axios.get(`/api/user/${username}`);
    console.log('Email in getUser Function: ', email)
    const { data } = await axios.get(`http://localhost:8765/api/user/${email}`);

    return data;
  } catch (error) {
    return { error: "Password doesn't match" };
  }
}

// Get user details for Aroha Technologies recruitments
export async function getArohaRecruitments() {
  try {
    const response = await axios.get("/api/getArohaRecruitments");
    return response.data;
  } catch (error) {
    return { error: "Failed to fetch Aroha Technologies recruitments" };
  }
}
// Get the admin post details by the means of status for recuter
export async function getAdminPostbyStatus() {
  try {
    const response = await axios.get("/api/getAdminPostbyStatus");
    return response.data;
  } catch (error) {
    return { error: "Failed to fetch Aroha Technologies recruitments" };
  }
}
// Get all user details
export async function getAllUserDetails() {
  const token = localStorage.getItem("token");
  try {
    // Set up headers with the bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make an asynchronous HTTP GET request using axios with headers
    const response = await axios.get("/api/getUserDetails", { headers });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors by returning an object with an error message
    return { error: "Failed to fetch user details" };
  }
}
// Get user details based on search criteria
export async function getUserDetails(searchCriteria) {
  const token = localStorage.getItem("token");
  try {
    // Set up headers with the bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make an asynchronous HTTP GET request using axios with search criteria as params and headers
    const response = await axios.get("/api/getUserDetails", {
      params: searchCriteria,
      headers,
    });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors by returning an object with an error message
    return { error: "Failed to fetch user details" };
  }
}

// Function to fetch candidate counts based on ticket number
export async function getCandidateCounts(ticketNumber) {
  try {
    const response = await axios.get(`/api/getCountByTicket/${ticketNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate counts:", error);
    return { error: "Failed to fetch candidate counts" };
  }
}
// Get all Client details
export async function getAllAdminePostClientDetails() {
  try {
    const response = await axios.get("/api/getAdminPostClientRequirement");
    return response.data;
  } catch (error) {
    return { error: "Failed to fetch user details" };
  }
}

// Get Client details based on search criteria
export async function getAdminPostClientRequirement(searchCriteria) {
  try {
    const response = await axios.get("/api/getAdminPostClientRequirement", {
      params: searchCriteria,
    });
    return response.data;
  } catch (error) {
    return { error: "Failed to fetch user details" };
  }
}

// Register user
export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`api/register`, credentials);
    let { username, email } = credentials;
    // Send email
    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}
// post the recuterpostng details
export async function recuterpost(credentials) {
  try {
    const token = await localStorage.getItem("token");
    const response = await axios.post("/api/recuterpost", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(response.data.msg);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(error.response.data.error);
    } else {
      return Promise.reject("An error occurred. Please try again later.");
    }
  }
}
// post the recruiter posting details to the server
export async function Adminpost(credentials) {
  try {
    // Assuming you have a valid token in localStorage
    const token = localStorage.getItem("token");

    const response = await axios.post("/api/Adminpost", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error posting recruiter:", error);
    return { error: "Couldn't post recruiter" };
  }
}
// updating the recuter posting details
export async function updateRecuterpost(id, credentials) {
  try {
    const token = await localStorage.getItem("token");
    const response = await axios.put(
      `/api/updateRecuterpostById/${id}`,
      credentials,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Assuming your server returns an appropriate status or message on success
    if (response.status === 200) {
      return Promise.resolve("User details updated successfully");
    } else {
      return Promise.reject({ error: "Failed to update user details" });
    }
  } catch (error) {
    return Promise.reject(error); // Return the actual error for frontend handling
  }
}
// updating the Admin posting details
export async function updateAdminpostById(id, credentials) {
  try {
    const token = await localStorage.getItem("token");
    const response = await axios.put(
      `/api/updateAdminpostById/${id}`,
      credentials,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data.msg);
  } catch (error) {
    return Promise.reject({ error: "Couldn't update recruitment post" });
  }
}

// delete the admin post by id
export async function deleteAdminpostById(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`/api/deleteAdminpostById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(response.data.msg);
  } catch (error) {
    return Promise.reject({ error: "Couldn't delete recruitment post" });
  }
}

// Helper function to get recuter post user details by _id
export async function getUserById(userId) {
  try {
    const response = await axios.get(`/api/postuser/${userId}`);
    return response.data.data; // Assuming your server returns the user data in the format { data: user }
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
}
// Helper function to fetch Adminpost details by _id
export async function getAdmindetailsById(userId) {
  try {
    const response = await axios.get(`/api/getAdminPostById/${userId}`);
    return response.data.data; // Assuming your server returns the user data in the format { data: user }
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
}

// Helper function to fetch Adminpost details by _id
export async function getRecruterPostDetailsById(userId) {
  try {
    const response = await axios.get(
      `/api/getRecruterPostDetailsById/${userId}`
    );
    return response.data.data; // Assuming your server returns the user data in the format { data: user }
  } catch (error) {
    throw new Error("Failed to fetch user details");
  }
}

// Login function
  // export async function verifyPassword({ username, password }) {
  //   try {
  //     if (!username) {
  //       throw new Error("Username is required");
  //     }

  //     const { data } = await axios.post("/api/login", { username, password });
  //     return { data };
  //   } catch (error) {
  //     return Promise.reject({
  //       error: "Password doesn't match",
  //       originalError: error,
  //     });
  //   }
  // }


// *** local testing by Rafiq ***
export async function verifyPassword({ email, password }) {
    try {
      if (!email) {
        throw new Error("Username is required");
      }

      const { data } = await axios.post("http://localhost:8765/api/login", { email, password });
      console.log('React Data: ',  { data })
      return { data };
    } catch (error) {
      return Promise.reject({
        error: "Password doesn't match",
        originalError: error,
      });
    }
  }

// Update user function
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/api/updateuser", response, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile" });
  }
}

// Generate OTP
export async function generateOTP(userEmail) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("http://localhost:8765/api/generateOTP", { params: { email: userEmail } });
    // Send mail with the 
    if (status === 201) {
      console.log('OTP is generating properly(Helper.js): ', {email: userEmail})

      // Fetch user details using email
      const user = await getUser(userEmail);

      if (!user) {
        console.error("User not found for the provided email:", userEmail);
        return Promise.reject({ error: "User not found" });
      }
      console.log('Data: ', user)
      const {username, email} = user
      const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("http://localhost:8765/api/registerMail", {
        username: username,
        userEmail: email,
        text,
        subject: "Password recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      const { status, data } = error.response;
      return Promise.reject({ status, error: data.error });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ error: "No response received from the server" });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        error: "An error occurred while making the request",
      });
    }
  }
}

export async function verifyOTP({ email, code }) {
  try {
    if (!email || !code) {
      throw new Error("Email or OTP code is missing!");
    }

    const response = await axios.get("http://localhost:8765/api/verifyOTP", {
      params: { email, code },
    });
    console.log("Api response in Helper: ", response);
    const { data, status } = response;
    return { data, status };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      const { status, data } = error.response;
      return Promise.reject({ status, error: data.error });
      // throw { status, error: data.error };
      // return {status, error: data.error}
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ error: "No response received from the server" });
      // throw { error: "No response received from the server" };
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        error: "An error occurred while making the request",
      });
      // throw { error: "An error occurred while making the request" };
    }
  }
}



// Reset password
export async function resetPassword({ email, password }) {

  console.log('Data in resetPassword: ', {email, password})
  try {
    const { data, status } = await axios.put("http://localhost:8765/api/resetPassword", {
      email,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    console.log('Got some error in resetPassword')
    return Promise.reject({ error });
  }
}

//complaient details
export async function complaient(credentials) {
  try {
    const token = await localStorage.getItem("token");
    const response = await axios.post("/api/complaient", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(response.data.msg);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(error.response.data.error);
    } else {
      return Promise.reject("An error occurred. Please try again later.");
    }
  }
}

// Function to get recruiter-sourced details based on username and date range
export async function getRecuterSourcedDetails(username, fromDate, toDate) {
  try {
    let url = `/api/getRecuterSourcedDetails/${username}`;

    // Add fromDate and toDate as query parameters if provided
    if (fromDate && toDate) {
      url += `?fromDate=${fromDate}&toDate=${toDate}`;
    }

    const response = await axios.get(url);

    if (response.status === 200) {
      const data = response.data;
      // Process data as needed here
      return data;
    } else {
      throw new Error("Failed to fetch recruiter-sourced details");
    }
  } catch (error) {
    return { error: "No data founded" };
  }
}

export async function getCountsForAllTickets() {
  try {
    const response = await axios.get(`/api/getCountsForAllTickets`);
    return response.data; // Assuming the response is JSON
  } catch (error) {
    console.error("Error fetching counts:", error);
    throw error;
  }
}

// Function to fetch user working progress data from the backend API
export async function fetchUserWorkingProgress() {
  try {
    const response = await axios.get("/api/getuserworkingprogress");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user working progress: " + error.message);
  }
}

// Function to fetch all usernames from the backend API
export async function getAllUsernames() {
  try {
    const response = await axios.get("/api/getallUsername");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching usernames: " + error.message);
  }
}

export async function getAllDomains() {
  try {
    const response = await axios.get("/api/getAllDomains");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching usernames: " + error.message);
  }
}

export async function getAllTechstack() {
  try {
    const response = await axios.get("/api/getAllTechstack");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching usernames: " + error.message);
  }
}

export const postClientDetails = async (postclientDetails) => {
  try {
    const response = await axios.post(
      "/api/postClientDetails",
      postclientDetails
    ); // Adjust the URL as necessary
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while posting client details");
  }
};

export async function getClientNames() {
  try {
    const response = await axios.get("/api/getClientNames");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching usernames: " + error.message);
  }
}

// Function to get clients with optional search query
export const getClients = async (searchQuery = "") => {
  try {
    const response = await axios.get("/api/getClients", {
      params: { Clientname: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching client details: " + error.message);
  }
};

export const getClientById = async (id) => {
  try {
    const response = await axios.get(`/api/getClientById`, {
      params: { id },
    });
    return response.data.client;
  } catch (error) {
    console.error(
      "Error fetching client by ID:",
      error.response ? error.response.data : error.message
    );
    throw new Error(error.response?.data?.message || "Error fetching client.");
  }
};

// Function to update client details
export const updateClientDetails = async (id, updateData) => {
  try {
    const response = await axios.put(`/api/updateClient/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};
