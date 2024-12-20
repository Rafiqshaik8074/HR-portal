import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/Helper";
import { useNavigate, Link } from "react-router-dom";
import image from "../assets/yellow-forgot-password.png";

import "../style/Recovery.css";
import { useEffect } from "react";

const Recovery = () => {
  const { username } = useAuthStore((state) => state.auth);
  const { email } = useAuthStore((state) => state.auth);

  const setUsername = useAuthStore((state) => state.setUsername);
  const setEmail = useAuthStore((state) => state.setEmail);

  const [OTP1, setOTP1] = useState("");
  const [OTP2, setOTP2] = useState("");
  const [OTP3, setOTP3] = useState("");
  const [OTP4, setOTP4] = useState("");
  const [OTP5, setOTP5] = useState("");
  const [OTP6, setOTP6] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Recovery Name: ", username, "\nRecovery Email: ", email);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      console.log("OTP sending for : ", email);
      await generateOTP(email);
      toast.success("OTP has been sent to your email", { autoClose: 3000 });
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const complete_otp = OTP1 + OTP2 + OTP3 + OTP4 + OTP5 + OTP6;

    console.log("Default email: ", email);
    console.log("Entered OTP: ", complete_otp, "type: ", typeof complete_otp);

    try {
      setLoading(true);

      // Verify OTP
      const { status, error } = await verifyOTP({
        email,
        code: complete_otp.toString(),
      });

      // Toast notification for verification
      await toast.promise(Promise.resolve(status === 201), {
        pending: "Verifying OTP...", // Displayed while resolving
        success: "Verification successful", // If resolved
        error: error || "Wrong OTP! Please check your email again.", // If rejected
      });

      // Redirect if status is 201
      if (status === 201) {
        navigate("/reset");
      }
    } catch (error) {
      // Catch and handle any errors
      console.error("Error:", error);

      // Display error in toast
      if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Ensure loading is cleared
    }
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const complete_otp = OTP1 + OTP2 + OTP3 + OTP4 + OTP5 + OTP6;
  //   console.log("Username: ", username);
  //   console.log("Entered OTP: ", complete_otp, "type: ", typeof complete_otp);
  //   console.log(
  //     "New entered OTP: ",
  //     complete_otp.toString(),
  //     typeof complete_otp.toString()
  //   );

  //   try {
  //     setLoading(true);
  //     const { status, error } = await verifyOTP({
  //       username,
  //       code: complete_otp.toString(),
  //     });

  //     // await toast.promise(Promise.resolve(status === 201), {
  //     //   pending: "Verifying OTP...", // Displayed while promise is resolving
  //     //   success: "Verification successful",
  //     //   error: "Wrong OTP! Please check your email again.",
  //     // });

  //     await toast.promise(
  //       new Promise((resolve, reject) => {
  //         if (status === 201) {
  //           resolve(); // Resolves the promise if status is 201
  //         } else {
  //           reject(); // Rejects the promise if status is not 201
  //         }
  //       }),
  //       {
  //         pending: "Verifying OTP...", // Displayed while promise is resolving
  //         success: "Verification successful", // Displayed if promise resolves
  //         error: "Wrong OTP! Please check your email again.", // Displayed if promise rejects
  //       }
  //     );

  //     if (status === 201) {
  //       navigate("/reset");
  //     }
  //     else{
  //       console.log('Invalid OTP')
  //       // toast.error(" Invalid OTP")
  //     }
  //   } catch (error) {
  //     // console.error(error);
  //     // console.log(error.error)

  //     if(error.error){
  //       toast.error(String(error.error))
  //     } else {
  //       // Fallback for unexpected errors
  //       console.error("Unexpected Error:", error);
  //       toast.error("An unexpected error occurred. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const moveToNext = (e, nextId, prevId) => {
    if (e.target.value.length === 1 && nextId !== "") {
      let nextElement = document.getElementById(nextId);
      if (nextElement) {
        nextElement.focus();
      }
    }

    // else if(e.target.value === '' && prevId !== ""){

    //   let previousElement = document.getElementById(prevId)
    //   if(previousElement){
    //     previousElement.focus();
    //   }
    // }
  };

  const handleBackspace = (e, prevId) => {
    if (e.key === "Backspace" && e.target.value === "" && prevId !== "") {
      let previousElement = document.getElementById(prevId);
      if (previousElement) {
        previousElement.focus();
      }
    }
  };

  useEffect(() => {
    // Automatically focus the first input on page load
    let firstinput = document.getElementById("otp1");
    if (firstinput) {
      firstinput.focus();
    }
  }, [otpSent]);

  const handleResendOTP = () => {
    handleSendOTP();
  };

  return (
    <section id="container">
      <Toaster position="top-center" reverseOrder={false} />

      <h1>RECOVERY</h1>

      {!otpSent ? (
        <div className="main-part">
          <div className="left-part">
            <img src={image} alt="forgot-password" />
          </div>
          <div className="forgot-password right-part">
            <label htmlFor="un">
              <h1>Forgot</h1>
              <h1>Your Password?</h1>
            </label>
            <p>Please enter your Email to send OTP</p>
            <input
              type="text"
              id="un"
              placeholder="Enter Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {/* <span className="text-lg w-2/3 text-center text-muted">
                Send OTP to your e-mail to recover
              </span>{" "}
              &nbsp; */}
            <button type="button" onClick={handleSendOTP} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <Link to="/">Back to Login</Link>
          </div>
        </div>
      ) : (
        <div className="main-part">
          <div className="left-part">
            <img
              src="https://t4.ftcdn.net/jpg/08/57/79/23/240_F_857792341_hvOc7I92kxju2MUtVJN9WDw6FIeIV4fn.jpg"
              alt=""
            />

            {/* <img src="https://t4.ftcdn.net/jpg/05/54/22/69/240_F_554226902_eaFqOYLyeTMXY1RLHcVi6psKYdkSv4cF.jpg" alt="" /> */}
          </div>
          <Form className="right-part otp" onSubmit={onSubmit}>
            <h2>OTP Verification Code</h2>

            <p>
              We have sent you the 6 digits OTP verification code to your email
              address
            </p>

            {/* <input
                onChange={(e) => setOTP(e.target.value)}
                type="text"
                placeholder="OTP..."
              /> */}

            <div className="otp-input">
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => setOTP1(e.target.value)}
                id="otp1"
                onInput={(e) => {
                  moveToNext(e, "otp2", "");
                }}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => setOTP2(e.target.value)}
                id="otp2"
                onInput={(e) => {
                  moveToNext(e, "otp3", "otp1");
                }}
                onKeyDown={(e) => handleBackspace(e, "otp1")}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => setOTP3(e.target.value)}
                id="otp3"
                onInput={(e) => {
                  moveToNext(e, "otp4", "otp2");
                }}
                onKeyDown={(e) => handleBackspace(e, "otp2")}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => setOTP4(e.target.value)}
                id="otp4"
                onInput={(e) => {
                  moveToNext(e, "otp5", "otp3");
                }}
                onKeyDown={(e) => handleBackspace(e, "otp3")}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => setOTP5(e.target.value)}
                id="otp5"
                onInput={(e) => {
                  moveToNext(e, "otp6", "otp4");
                }}
                onKeyDown={(e) => handleBackspace(e, "otp4")}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="number"
                max-lenth="1"
                onChange={(e) => {
                  setOTP6(e.target.value);
                }}
                id="otp6"
                onInput={(e) => {
                  moveToNext(e, "", "otp5");
                }}
                onKeyDown={(e) => handleBackspace(e, "otp5")}
                autocomplete="off"
                inputmode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <p>
              Didn't receive a OTP ?{" "}
              <span
                onClick={handleResendOTP}
                disabled={loading}
                className="resend-otp"
              >
                Re-Send OTP
              </span>
            </p>
            <button type="submit" className="verify" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            <Link to="/" className="otp-login-link">
              Back to Login
            </Link>
          </Form>
        </div>
      )}
    </section>
  );
};

export default Recovery;
