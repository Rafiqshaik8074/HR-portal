import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/Helper";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Recovery name: ", username);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await generateOTP(username);
      setOtpSent(true);
      toast.success("OTP has been sent to your email");
    } catch (error) {
      toast.error("Failed to send OTP!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { status } = await verifyOTP({ username, code: OTP.toString() });

      await toast.promise(Promise.resolve(status === 201), {
        pending: "Verifying OTP...", // Displayed while promise is resolving
        success: "Verification successful",
        error: "Wrong OTP! Please check your email again.",
      });

      if (status === 201) {
        navigate("/reset");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleSendOTP();
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Toaster position="top-center" reverseOrder={false} />
      <Row>
        <Col className="text-center">
          <Card className="title py-4">
            <Card.Body>
              <h4 className="text-4xl font-bold mb-4">Recovery</h4>
              <label htmlFor="">Enter Username:</label>
              <input type="text" />
              <br /> <br />
              {!otpSent ? (
                <div>
                  <span className="text-lg w-2/3 text-center text-muted">
                    Send OTP to your e-mail to recover
                  </span>{" "}
                  &nbsp;
                  <Button
    type="button"
                    className="btn btn-primary custom-button"
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              ) : (
                <Form className="py-1" onSubmit={onSubmit}>
                  <div className="textbox d-flex flex-column align-items-center">
                    <span className="py-4 text-lg text-center text-muted fw-bold">
                      Enter 6-Digit OTP Sent to Your Email
                    </span>
                    <Form.Control
                      onChange={(e) => setOTP(e.target.value)}
                      type="text"
                      placeholder="OTP..."
                      className="w-75 mb-4"
                      style={{ fontSize: "18px", padding: "10px" }}
                    />
                    <Button
                      type="submit"
                      className="btn btn-success custom-button"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                  <div className="py-2">
                    <span className="text-muted">
                      Can't Get OTP?:{" "}
                      <Button
                        className="btn btn-danger"
                        onClick={handleResendOTP}
                        disabled={loading}
                      >
                        Re-Send OTP
                      </Button>
                    </span>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Recovery;
