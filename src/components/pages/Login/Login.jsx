import React from "react";

import Container from "../../reusable/Container/Container";
import Input from "../../reusable/Input/Input";

import "./Login.css";

const Login = () => {
  return (
    <div className="login">
      <Container className="login-content">
        <h1>Login</h1>
        <Input label="Email" />
        <Input label="Password" />
      </Container>
    </div>
  );
};

export default Login;
