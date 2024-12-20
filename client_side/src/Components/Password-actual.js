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
import { passwordValidate } from "../helper/Validate.js";
import useFetch from "../hooks/Fetch.hook.js";
import { verifyPassword } from "../helper/Helper.js";
import { useAuthStore } from "../store/store.js";
import "../style/Password.css";
import Loader from "./Loader.js";

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
    <Container
      fluid
      className="password-container-wrapper vh-100 d-flex align-items-center justify-content-center"
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Row>
        <Col className="text-center">
          <Card className="title py-4  custom-card">
            <Card.Body>
              <h4 className="text-5xl font-bold">
                Hello {apiData?.firstName || apiData?.username}
              </h4>
              <span className="py-4 text-xl w-2/3 text-center text-muted">
                Exploring More by connecting with Us
              </span>
              <Form className="py-1" onSubmit={formik.handleSubmit}>
                <Row className="justify-content-center">
                  <Col xs={12} md={6}>
                    <div className="profile d-flex justify-content-center py-4">
                      <Image
                        src={apiData?.profile || profile}
                        alt="avatar"
                        className="img-fluid"
                        style={{
                          borderRadius: "50%",
                          width: "600px",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="textbox d-flex flex-column align-items-center ">
                  <input
                    type="text"
                    name="username" // Add the username field
                    className="visually-hidden" // Hide the username field visually
                    aria-hidden="true" // Hide the username field from accessibility tools
                    autoComplete="username" // Optional: set autocomplete for the username field
                  />
                  <Form.Control
                    {...formik.getFieldProps("password")}
                    type="password"
                    placeholder="Enter Password"
                    className="w-75 mb-2"
                    autoComplete="new-password"
                  />
                  <Button
                    type="submit"
                    className="btn btn-success custom-button"
                  >
                    Sign in
                  </Button>
                </div>
                <div className="align-items-center py-4">
                  <span className="text-muted">
                    Forgot Password?:
                    <Link className="text-danger" to="/recovery">
                      Recovery Now
                    </Link>
                  </span>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Password;
