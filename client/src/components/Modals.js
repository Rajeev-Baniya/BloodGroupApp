import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
Modal.setAppElement("#root");

const Modals = (props) => {
  const [modalData, setModalData] = useState({
    email: "",
    password: "",
  });
  const [deleteErrors, setDeleteErrors] = useState([]);
  const { email, password } = modalData;
  const onChange = (e) =>
    setModalData({ ...modalData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    // console.log(props.id);
    e.preventDefault();
    console.log(modalData);
    const user = {
      email,
      password,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(
        "http://localhost:5000/users/delete/" + props.id,
        body,
        config
      );
      console.log(res.data);
      if (res.data.status == "success") {
        window.location = "/";
      } else {
        console.log(res.data);
        const value = res.data.data;
        const newValue = Object.values(value);
        setDeleteErrors(newValue);
      }
    } catch (error) {
      console.error(error.response.message);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeleteErrors([]);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [deleteErrors]);

  return (
    <div>
      <Modal
        isOpen={props.open}
        shouldCloseOnOverlayClick={false}
        style={{
          background: {
            backgroundSize: "cover",
          },
          overlay: {
            position: "fixed",
          },
          content: {
            color: "maroon",
          },
        }}
      >
        <h2>Delete</h2>
        <h3>Delete the user data</h3>
        {deleteErrors.map((item, index) => {
          return (
            <p key={index} className="error">
              {item}
            </p>
          );
        })}
        <form className="modalForm" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              className="form-control"
              name="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => onChange(e)}
              autoComplete="off"
            />
          </div>
          <br />
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => onChange(e)}
              autoComplete="off"
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-primary"
              value="Delete User"
            />
          </div>
          <br />
          <button
            onClick={() => props.change(false)}
            className="btn btn-danger"
          >
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Modals;
