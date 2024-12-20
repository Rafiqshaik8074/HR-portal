import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/Validate";
import useFetch from "../hooks/Fetch.hook.js";
import { verifyPassword } from "../helper/Helper";
import { useAuthStore } from "../store/store";
import "../style/Password.css";
import Loader from "./Loader";

const Password = () => {
  const navigate = useNavigate();

  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const onSubmit = async (values) => {
    try {
      let loginPromise = verifyPassword({
        username,
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
  };

  const formik = useFormik({
    initialValues: {
      password: "", // Change 'Password' to 'password' to match the field name
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: onSubmit,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (serverError) {
    return <Alert variant="danger">{serverError.message}</Alert>;
  }

  return (
<div className="password-container-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="card custom-card">
          <h4 className="card-title">
            Hello {apiData?.firstName || apiData?.username}. Modified only html and css
          </h4>
          <p className="card-subtitle">
            Exploring More by connecting with Us
          </p>
          <form className="form-container" onSubmit={formik.handleSubmit}>
            <div className="profile-wrapper">
              <img
                src={apiData?.profile || profile}
                alt="avatar"
                className="profile-image"
                style={{
                  borderRadius: '50%',
                  width: '250px',
                  height: '250px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="username"
                className="hidden-input"
                aria-hidden="true"
                autoComplete="username"
              />
              <input
                {...formik.getFieldProps('password')}
                type="password"
                placeholder="Enter Password"
                className="form-input"
                autoComplete="new-password"
              />
              <button type="submit" className="form-button">
                Sign in
              </button>
            </div>
            <div className="recovery-container">
              <span className="text-muted">
                Forgot Password?{' '}
                <Link to="/recovery" className="text-danger">
                  Recovery Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
