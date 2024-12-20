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

import { passwordValidate } from "../helper/Validate";
import useFetch from "../hooks/Fetch.hook.js";
import { verifyPassword } from "../helper/Helper";
import toast, { Toaster } from "react-hot-toast";
import '../style/Username.css'

// -----------------------------------------------------------------------------------------

const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const { username } = useAuthStore((state) => state.auth);
  // const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  // const formik = useFormik({
  //   initialValues: {
  //     username: "",
  //   },
  //   validate: usernamevaldate,
  //   validateOnBlur: false,
  //   validateOnChange: false,
  //   onSubmit: async (values) => {
  //     console.log("On submit form value: ", values);
  //     setUsername(values.username);
  //     navigate("/password");
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: async (values) => {
      console.log("Values of Form: ", values);
      const errors = {};
      const usernameErrors = await usernamevaldate(values);
      const passwordErrors = await passwordValidate(values);
      return { ...usernameErrors, ...passwordErrors };
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log("Form submit: ", values);
      try {
        await setUsername(values.username);
        console.log("User name: ", username);
        console.log(username, values.password);
        try {
          let loginPromise = verifyPassword({
            username: values.username,
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
      //   try {
      //     setUsername(values.username);
      //     let loginPromise = new Promise((resolve, reject) => {
      //       if (values.password === "correctPassword")
      //         resolve("Login successful");
      //       else reject("Password does not match");
      //     });
      //     toast.promise(loginPromise, {
      //       loading: "Checking...",
      //       success: <b>Login Successfully..!</b>,
      //       error: <b>Password Not Match..</b>,
      //     });

      //     await loginPromise;
      //     navigate("/home");
      //   } catch (error) {
      //     console.error(error);
      //   }
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
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="User Name"
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
