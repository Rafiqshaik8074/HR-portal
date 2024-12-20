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
import { useNavigate, Link } from "react-router-dom";
import profile from "../assets/undraw_Pic_profile_re_7g2h.png";
import "../style/Username.css";
// import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernamevaldate } from "../helper/Validate";
import { useAuthStore } from "../store/store";
import anime from '../assets/hero-img.png'

// ----------------------------------------------Password modules --------------------------

import { passwordValidate, emailValidate } from "../helper/Validate";
import useFetch from "../hooks/Fetch.hook.js";
import { verifyPassword } from "../helper/Helper";
import toast, { Toaster } from "react-hot-toast";
import '../style/Username.css'

// -----------------------------------------------------------------------------------------

const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  const setUserEmail = useAuthStore((state) => state.setEmail);

  // const { username } = useAuthStore((state) => state.auth);
  const { email } = useAuthStore((state) => state.auth);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: async (values) => {
      console.log("Values of Form: ", values);
      const errors = {};
      const emailErrors = await emailValidate(values);
      const passwordErrors = await passwordValidate(values);
      return { ...emailErrors, ...passwordErrors };
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log("Form submit: ", values);
      try {
        await setUserEmail(values.email);
        console.log("User name: ", email);
        console.log(email, values.password);
        try {
          let loginPromise = verifyPassword({
            email: values.email,
            password: values.password,
          });
          toast.promise(loginPromise, {
            loading: "Checking...",
            success: <b>Login Successfully..!</b>,
            error: <b>Password Not Match..</b>,
          });

          const res = await loginPromise;
          let { token } = res.data;
          localStorage.setItem("token", token);
          navigate("/home");
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.log("Got some Error while submitting values...:", error);
      }

    },
  });

  return (
    <section id="username">
    <div className="container-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="card-container">
          <img src={profile} alt="avatar" className="profile-image" />
          <h4 className="card-title">Login</h4>
          <p className="card-subtitle">Exploring More by connecting with Us</p>
          <form onSubmit={formik.handleSubmit} className="form-container">
           
              
          
            <div className="form-group">
              <input
                {...formik.getFieldProps("email")}
                type="text"
                placeholder="Enter Email"
                className="form-input"
              />

              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Enter Password"
                className="form-input"
                autoComplete="new-password"
              />
              <button type="submit" className="form-button">
                Let's Go
              </button>
            </div>

            <div className="recovery-container">
              <span className="text-muted">
                Forgot Password?{" "}
                <Link to="/recovery" className="text-danger">
                  Recovery Now
                </Link>
              </span>
            </div>
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
