import React from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Image,
//   Form,
//   Button,
//   Card,
// } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import profile from "../assets/profile.png";
import profile from "../assets/undraw_Pic_profile_re_7g2h.png";
import anime from "../assets/hero-img.png"
import "../style/Username.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernamevaldate } from "../helper/Validate";
import { useAuthStore } from "../store/store";

const Username = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  console.log('Username: ', username)
  const setUsername = useAuthStore((state) => state.setUsername);

  const formik_username = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernamevaldate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log('On submit form value: ', values)
      setUsername(values.username);
      navigate("/password");
    },
  });
  return (
    <section id="username">
      
    <div className="container-wrapper">
       <Toaster position="top-center" reverseOrder="{false}" /> 
      <div className="content-wrapper">
         
        <div className="card-container">
          <div className="profile-wrapper">
              <img src={profile} alt="avatar" className="profile-image" />
          </div>
          <h4 className="card-title">Welcome</h4>
          <p className="card-subtitle">Exploring More by connecting with Us</p>
          <form onSubmit={formik_username.handleSubmit} className="form-container">
            
            
              <input {...formik_username.getFieldProps("username")} type="text"
              placeholder="User Name" className="form-input" />
              <button type="submit" className="form-button">Let's Go</button>
         
          </form>
        </div>
      </div>
    </div>

    <div className="right-container">
      <img src={anime} alt="design-pattern" />
    </div>
  </section>
  );
};

export default Username;
