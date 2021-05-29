import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    district: "",
    phone: "",
    password: "",
    confirm_password: "",
    blood_group: "",
  });
  const [errors, setErrors] = useState(false);
  const [showErrors, setShowErrors] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const {
    name,
    email,
    district,
    phone,
    password,
    confirm_password,
    blood_group,
  } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      console.log("Passwords donot match");
    } else {
      const newUser = {
        name,
        email,
        password,
        confirm_password,
        district,
        blood_group,
        phone,
      };
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = JSON.stringify(newUser);
        const res = await axios.post(
          "http://localhost:5000/users/register",
          body,
          config
        );
        console.log(res.data);
        //console.log(res.data.status);
        if (res.data.status === "success") {
          // window.location = "/";
          setFormData([]);
          setRedirect(true);
        } else {
          setErrors(true);
          const values = res.data.data;
          const newValue = Object.values(values);
          // console.log(newValue);
          setShowErrors(newValue);
          // console.log(showErrors);
        }
      } catch (error) {
        console.error(error.response.message);
      }
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowErrors([]);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showErrors]);

  return (
    <div className="container">
      <h3> Register your data </h3>
      {/* {errors ? <p>my errors</p> : null} */}
      {showErrors.map((item, index) => {
        return (
          <p key={index} className="error">
            {item}
          </p>
        );
      })}

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            required
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            placeholder="Email"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="number"
            required
            className="form-control"
            name="phone"
            value={phone}
            placeholder="Phone"
            onChange={(e) => onChange(e)}
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            required
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            placeholder="Password"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            required
            className="form-control"
            name="confirm_password"
            value={confirm_password}
            onChange={(e) => onChange(e)}
            placeholder="Confirm Password"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input
            type="text"
            required
            className="form-control"
            name="district"
            value={district}
            onChange={(e) => onChange(e)}
            placeholder="District"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <input
            type="text"
            required
            className="form-control"
            name="blood_group"
            autoComplete="off"
            value={blood_group}
            onChange={(e) => onChange(e)}
            placeholder="Blood Group"
          />
        </div>
        <br />
        <div className="form-group">
          <input
            type="submit"
            className="btn btn-primary"
            value="create user"
          />
        </div>
      </form>
      <hr />
      {redirect ? <Redirect to="/" /> : null}
    </div>
  );
};

export default Register;
