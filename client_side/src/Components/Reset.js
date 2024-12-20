import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import "../style/reset-password.css";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../helper/Validate";
import { resetPassword } from "../helper/Helper";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/Fetch.hook";

// import key_photo from '../assets/reset-password-removebg-preview.png'
import key_photo from "../assets/reset-password2.jpg";

const Reset = () => {
  const { username } = useAuthStore((state) => state.auth);
  const { email } = useAuthStore((state) => state.auth);
  console.log("Username in Reset: ", username);
  console.log("Email in Reset: ", email);
  const navigate = useNavigate();

  const [page, setPage] = useState(false);

  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");
  console.log("Current User name in Reset: ", username);
  console.log("Current User email in Reset: ", email);
  useEffect(
    (status) => {
      if (status) {
        // Handle status
      }
    },
    [isLoading, apiData, serverError]
  );

  console.log(localStorage.getItem("token"));

  const onSubmit = async (values) => {
    try {
      let resetPromise =  resetPassword({ email, password: values.password });

      await toast.promise(resetPromise, {
        loading: "Updating",
        success: <b>Reset successfully..!</b>,
        error: <b>Could Not Reset!</b>,
      });

      await resetPromise;
      // if (localStorage.getItem("token")) {
      //   navigate("/home");
      // } else {
      //   navigate("/");
      // }
      setPage(true)


    } catch (error) {
      setPage(false)
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      Confirm_pwt: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: onSubmit,
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.setItem("resetPageRefreshed", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const resetPageRefreshed = localStorage.getItem("resetPageRefreshed");

    if (resetPageRefreshed) {
      localStorage.removeItem("resetPageRefreshed");
      navigate("/");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (serverError) {
    return <Alert variant="danger">{serverError.message}</Alert>;
  }

  if (status && status !== 201) {
    return <Navigate to="/" replace={true} />;
  }

  const removePrompt = (e)=>{
    let prmt = document.querySelector('#prompt-page')
    console.log('element: ', prmt)
    prmt.style.display = 'none'
    setPage(false)
  }

  return (
    <section id="reset">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="left-part">
        {/* <img src="https://i.pinimg.com/736x/a9/7c/37/a97c37dfd882d5c005abc54298d5525e.jpg" alt="" /> */}
        {/* <img src="https://i.pinimg.com/736x/50/23/5a/50235a1d8e6e22c9a29c82bef0d9e3fa.jpg" alt="" /> */}
        <img src={key_photo} alt="" />
      </div>
      <div className="reset-password right-part">
        <form className="form-container" onSubmit={formik.handleSubmit}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/008/122/938/non_2x/lock-for-website-symbol-icon-presentation-free-vector.jpg"
            alt="Lock image"
          />
          <h4 className="">Reset</h4>
          <h4 className="">Your Password</h4>
          {/* Add a hidden email field */}
          <input type="hidden" name="email" value={email} />
          <div className="form-box">
            <Form.Control
              {...formik.getFieldProps("password")}
              type="password"
              placeholder="Create New Password"
              className="inp"
              autoComplete="new-password"
            />
            <Form.Control
              {...formik.getFieldProps("Confirm_pwt")}
              type="password"
              placeholder="Confirm New Password"
              className="inp"
              autoComplete="new-password"
            />
            <button type="submit" className="btn">
              Reset
            </button>
            {localStorage.getItem("token") ? (
              <Link to="/home">Go to Home</Link>
            ) : (
              <Link to="/">Go to Login</Link>
            )}
          </div>
        </form>
      </div>

      <div
        id="prompt-page"
        style={page ? { display: "flex" } : { display: "none" }}
      >
        <div className="prompt-part">
          <h2>Your Password is Successfully Updated</h2>
          {localStorage.getItem("token") ? (
            <Link to="/home">Go to Home</Link>
          ) : (
            <Link to="/">Go to Login</Link>
          )}
          <button onClick={removePrompt}>Cancel</button>
        </div>
      </div>
    </section>
  );
};

export default Reset;
