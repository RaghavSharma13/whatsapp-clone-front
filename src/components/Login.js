import React from "react";
import { GoogleLogin } from "react-google-login";
import "./styles/Login.css";

import { setUser } from "../store/actions/userActions";
import { useDispatch } from "react-redux";

const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;

const Login = () => {
  const dispatch = useDispatch();

  const handleSignIn = async (googleData) => {
    dispatch(setUser(googleData.profileObj));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://seeklogo.com/images/W/whatsapp-icon-logo-8CA4FB831E-seeklogo.com.png"
          alt=""
        />
        <div className="login__text">
          <h1>Sign in to WhatApp Clone</h1>
        </div>

        <GoogleLogin
          clientId={REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Sign in with Google"
          onSuccess={handleSignIn}
          onFailure={handleSignIn}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};

export default Login;
