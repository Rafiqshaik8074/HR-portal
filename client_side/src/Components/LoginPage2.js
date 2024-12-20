import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernamevaldate, passwordValidate } from "../helper/Validate";
import { useAuthStore } from "../store/store";
import "../style/Loginpage2.css"; // CSS file for styling
import profile from "../assets/profile.png";
import useFetch from "../hooks/Fetch.hook";


const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);


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
        console.log("User name in form data: ", values.username);
        
        setUsername(values.username);
        // if (values.password === "shaik@123") {
        //   console.log('Password is correct....')
        //   toast.success("Login Successfully..!");
        //   navigate("/home");
        // } else {
        //   toast.error("Password Not Match..");
        // }

        let loginPromise = new Promise((resolve, reject) => {
          if (values.password === "shaik@123"){
            console.log('User data: ', username)
            console.log('Login is working2...: ')
            toast.success('Login Success!')
            resolve("Login successful");

          }
          else {
            // toast.error('Passowrd does not match')
            reject("Password does not match");
          }
        });
        toast.promise(loginPromise, {
          loading: "Checking...",
          success: <b>Login Successfully..!</b>,
          error: <b>Password Not Match..</b>,
        });

        await loginPromise;
        navigate("/home");
      } catch (error) {
        console.error(error);
      }
    },
  });

    if (isLoading) {
    // return <Loader />;
    console.log('Loading is working...')
  }

  return (
    <div className="combined-form-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="content-wrapper">
        <div className="card-container">
          <h4 className="card-title">Welcome Back!</h4>
          <p className="card-subtitle">Exploring More by connecting with Us</p>
          <form className="form-container" onSubmit={formik.handleSubmit}>
            <div className="profile-wrapper">
              <img src={profile} alt="avatar" className="profile-image" />
            </div>
            <div className="form-group">
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Enter Username"
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
  );
};

export default Username;
