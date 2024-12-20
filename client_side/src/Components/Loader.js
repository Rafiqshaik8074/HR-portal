import React from "react";
import './Loader.css'

const Loader = () => {
  return (
    <div className="overla">
      <div className="lds-ripple">
        <div>
          <h1>This is Loader</h1>
        </div>
        <div>
          <h2>This is Second Loading</h2>
        </div>
      </div>
    </div>
  );
};

export default Loader;