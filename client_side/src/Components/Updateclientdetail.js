import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClientById,
  updateClientDetails,
  getClientNames,
} from "../helper/Helper";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const Updateclientdetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      Clientname: "",
      Address: "",
      Email: "",
      MobileNumber: "",
      HrEmail: "",
      HrMobileNumber: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await updateClientDetails(id, values);
        toast.success(response.message);
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((err) => {
            toast.error(err.message);
          });
        } else {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    },
  });

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const client = await getClientById(id);
        formik.setValues({
          Clientname: client.Clientname || "",
          Address: client.Address || "",
          Email: client.Email || "",
          MobileNumber: client.MobileNumber || "",
          HrEmail: client.HrEmail || "",
          HrMobileNumber: client.HrMobileNumber || "",
        });
      } catch (error) {
        console.error("Error fetching client details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container
      fluid
      className="pt-5 d-flex align-items-center justify-content-center"
    >
      <Toaster />
      <Row className="w-100">
        <Col xs={12} md={12} lg={12} className="text-center py-4">
          <Card className="title py-4 mt-30 pt-5 d-flex flex-column">
            <Card.Header className="pt-30">
              <h4 className="text-5xl font-bold">Update Client Details!</h4>
            </Card.Header>
            <Card.Body className="flex-grow-1">
              <Form onSubmit={formik.handleSubmit} className="pt-4">
                <Row>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("Clientname")}
                      placeholder="Client Name*"
                      className="mb-2"
                      isInvalid={!!formik.errors.Clientname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.Clientname}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("Address")}
                      as="textarea"
                      placeholder="Address*"
                      className="custom-placeholder-style w-100 mb-2 text-center"
                      isInvalid={!!formik.errors.Address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.Address}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("Email")}
                      type="email"
                      placeholder="E-mail*"
                      className="custom-placeholder-style w-100 mb-2 text-center"
                      isInvalid={!!formik.errors.Email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.Email}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("MobileNumber")}
                      type="tel"
                      placeholder="Mobile Number*"
                      className="custom-placeholder-style w-100 mb-2 text-center"
                      isInvalid={!!formik.errors.MobileNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.MobileNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("HrEmail")}
                      type="email"
                      placeholder="HR E-mail*"
                      className="custom-placeholder-style w-100 mb-2 text-center"
                      isInvalid={!!formik.errors.HrEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.HrEmail}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      {...formik.getFieldProps("HrMobileNumber")}
                      type="tel"
                      placeholder="HR Mobile Number*"
                      className="custom-placeholder-style w-100 mb-2 text-center"
                      isInvalid={!!formik.errors.HrMobileNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.HrMobileNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <br />
                <Button type="submit" className="btn btn-success">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Updateclientdetail;
