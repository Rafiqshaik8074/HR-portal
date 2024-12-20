import { Link, useNavigate, Navigate } from "react-router-dom";
import "../style/logout.css";
import img from '../assets/boy-sitting-thinking.png'
const Logout = () => {
  let navigate = useNavigate();

//   let goToHome = () => {
//     navigate("/home");
//   };

  let goToLogin = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // if(localStorage.getItem('token')){
  return (
    <section id="logout">
      <div className="logout-main-part">
        <div class="logout-image-part">
            <img src={img} alt="" />
        </div>
        <div className="logout-content-box">
          <h1>Logged Out</h1>
          
          <p>You have successfully logged out.</p>
          <p>We hope to see you again soon!</p>
          <p>Thank You</p>
          <button onClick={goToLogin}>Login</button>
          {/* <button onClick={goToHome}>Little Bit More To Do</button> */}
        </div>
      </div>
    </section>
  );
  // }
  // else{
  //     return(
  //     <Navigate to='/' />
  //     )
  // }
};
export default Logout;
