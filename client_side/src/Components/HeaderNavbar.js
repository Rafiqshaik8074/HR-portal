import React, { useState } from "react";
import { Dropdown, Image, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImage from "../assets/profile.png";
import arohaImage from "../assets/aroha.jpeg";
import useFetch from "../hooks/Fetch.hook.js";
import "./HeaderNavbar.css";
import Complaient from "./Complaient";

import { useAuthStore } from '../store/store';

const HeaderNavbar = () => {
    const { username } = useAuthStore((state) => state.auth);
    const { email } = useAuthStore((state) => state.auth);
    const setUsername = useAuthStore((state) => state.setUsername);
    const setEmail = useAuthStore((state) => state.setEmail);

    

  const navigate = useNavigate();
  const [{ apiData, isError }] = useFetch();
  const [showModal, setShowModal] = useState(false);

  console.log('Current User in NavBar: ', username)


  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/logout");
  };

  // const handleModalShow = () => {
  //   setShowModal(true);
  // };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (isError) {
    return <p>Error loading data.</p>; // Display an error message
  }

  const updateUserName = ()=>{
    console.log('Current Username in Navbar: ', apiData)
    console.log('Current Username in Navbar: ', apiData.username)
    setUsername(apiData.username)
    setEmail(apiData.email)
  }


  return (
    <div className="header-navbar">
      <Link to="/home">
        <Image
          src={arohaImage}
          alt="Left Image"
          style={{ width: "80px", height: "35px", marginRight: "10px" }}
        />
      </Link>



      <h1 className="header-title">Welcome To Aroha Technologies </h1>


      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic" className="dropdown-profile">
          <div className="current-user">
          
          <h4>{apiData && apiData.username.toUpperCase()} <sup>{ <span>{apiData && apiData.position.toUpperCase()}</span>}</sup> </h4>
          {/* <span>{apiData && apiData.email}</span> */}
          <span>shaikrafiq9052707297@gmail.com</span>
          </div>
          <Image
            src={apiData?.profile || profileImage}
            alt="Profile Image"
            roundedCircle
            style={{ width: "30px", height: "30px" }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu align="right">
          <div className="text-center">
            <Link className="text-light text-decoration-none" to="/profile">
              Profile Settings
            </Link>
          </div>
          {/* <Dropdown.Divider />
          <div className="text-center"> 
          <Link as={Link} className="nav-link" onClick={handleModalShow}>
       
            Feedback
          </Link>
           
          </div> */}
          <Dropdown.Divider />
          <div className="text-center">
            {" "}
            {/* Center the Logout link */}
            <Link
              className="text-light text-decoration-none"
              onClick={updateUserName}
              to="/reset"
            >
              Change Password
            </Link>
          </div>
          <Dropdown.Divider />
          <div className="text-center">
            {" "}
            {/* Center the Logout link */}
            <Link
              className="text-light text-decoration-none"
              onClick={userLogout}
              to="/logout"
            >
              Logout
            </Link>
          </div>
         
          
        </Dropdown.Menu>
      </Dropdown>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <h2 className="table-header">User Feedback</h2>
        </Modal.Header>
        <Modal.Body>
          <Complaient />
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default HeaderNavbar;
