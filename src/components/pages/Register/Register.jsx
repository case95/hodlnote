import React from "react";

import Container from "../../reusable/Container/Container";
import Input from "../../reusable/Input/Input";

import "./Register.css";

const Register = () => {
  return (
    <div className="register">
      <Container className="register-content">
        <h1>Register</h1>
        <form>
          <Input label="First Name" />
          <Input label="Last Name" />
          <Input label="Email" />
          <Input label="Password" />
          <Input label="Repeat Password" />
        </form>
      </Container>
    </div>
  );
};

export default Register;
