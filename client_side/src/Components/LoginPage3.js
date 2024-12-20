import React from "react";
import { useNavigate, Link } from "react-router-dom";
import profile from "../assets/undraw_Pic_profile_re_7g2h.png";
import anime from "../assets/hero-img.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernamevaldate, passwordValidate } from "../helper/Validate";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/Fetch.hook";
import { verifyPassword } from "../helper/Helper";
import Loader from "./Loader";
import "../style/Username.css";
import "../style/Password.css";

const Username = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const setUsername = useAuthStore((state) => state.setUsername);
  const [{ isLoading, apiData, serverError }] = useFetch(username ? `/user/${username}` : null);

  /** Username form logic */
  const formik_username = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernamevaldate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate("/password");
    },
  });

  /** Password form logic */
  const onSubmitPassword = async (values) => {
    try {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });

      const res = await loginPromise;
      let { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const formik_password = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: onSubmitPassword,
  });

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (serverError) {
//     return <div className="alert alert-danger">{serverError.message}</div>;
//   }

  return (
    <div className="auth-container">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Username Section */}
      <section id="username">
        <div className="container-wrapper">
          <div className="content-wrapper">
            <div className="card-container">
              <div className="profile-wrapper">
                <img src={profile} alt="avatar" className="profile-image" />
              </div>
              <h4 className="card-title">Welcome</h4>
              <p className="card-subtitle">Exploring More by connecting with Us</p>
              <form
                onSubmit={formik_username.handleSubmit}
                className="form-container"
              >
                <input
                  {...formik_username.getFieldProps("username")}
                  type="text"
                  placeholder="User Name"
                  className="form-input"
                />
                <button type="submit" className="form-button">
                  Let's Go
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="right-container">
          <img src={anime} alt="design-pattern" />
        </div>
      </section>

      {/* Password Section */}
      {username && (
        <section id="password">
          <div className="password-container-wrapper">
            <div className="content-wrapper">
              <div className="card custom-card">
                <h4 className="card-title">
                  Hello {apiData?.firstName || apiData?.username}
                </h4>
                <p className="card-subtitle">
                  Exploring More by connecting with Us
                </p>
                <form
                  className="form-container"
                  onSubmit={formik_password.handleSubmit}
                >
                  <div className="profile-wrapper">
                    <img
                      src={apiData?.profile || profile}
                      alt="avatar"
                      className="profile-image"
                      style={{
                        borderRadius: "50%",
                        width: "250px",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      {...formik_password.getFieldProps("password")}
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
        </section>
      )}
    </div>
  );
};

export default Username
