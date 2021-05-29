import React, { useState, useEffect } from "react";
import axios from "axios";
import Group from "../components/Group";

const Home = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({
    district: "",
    blood_group: "",
  });
  const [searchErrors, setSearchErrors] = useState([]);
  const { district, blood_group } = search;
  const onChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(search);
    const searchData = {
      district,
      blood_group,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      //const body = JSON.stringify(searchData);
      if (searchData.district && searchData.blood_group) {
        const res = await axios.get(
          `http://localhost:5000/users/both/${searchData.district.toLowerCase()}/${searchData.blood_group.toUpperCase()}`,
          config
        );
        if (res.data.status == "success") {
          console.log(res.data);
          setData(res.data.data.users);
        } else {
          const value = res.data.data;
          const newValue = Object.values(value);
          setSearchErrors(newValue);
        }
      }
      if (searchData.district) {
        const res = await axios.get(
          `http://localhost:5000/users/district/${searchData.district.toLowerCase()}`,
          config
        );
        console.log(res.data);
        setData(res.data.data.users);
      }
      if (searchData.blood_group) {
        const res = await axios.get(
          `http://localhost:5000/users/blood/${searchData.blood_group.toUpperCase()}`,
          config
        );
        if (res.data.status == "success") {
          console.log(res.data);
          setData(res.data.data.users);
        } else {
          const value = res.data.data;
          const newValue = Object.values(value);
          setSearchErrors(newValue);
        }
      }
      if (searchData.district == "" && searchData.blood_group == "") {
        const res = await axios.get(`http://localhost:5000/users`, config);
        console.log(res.dat);
        setData(res.data.data.users);
      }
    } catch (error) {
      console.error(error.data);
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/users", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.data.users);
        setData(response.data.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchErrors([]);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchErrors]);

  const userDatas = () => {
    return data.map((currentItem) => {
      return (
        <Group
          myItem={currentItem}
          key={currentItem._id}
          id={currentItem._id}
        />
      );
    });
  };

  return (
    <div>
      <h3>Users and Blood group list</h3>
      <form onSubmit={(e) => onSubmit(e)} className="text-center">
        <h5>Search by district and blood group </h5>
        {searchErrors.map((item, index) => {
          return (
            <p key={index} className="error">
              {item}
            </p>
          );
        })}
        <input
          type="text"
          name="district"
          placeholder="Input distrct"
          value={district}
          onChange={(e) => onChange(e)}
          className="search"
          autoComplete="off"
        />
        <input
          type="text"
          name="blood_group"
          placeholder="Blood Group"
          value={blood_group}
          onChange={(e) => onChange(e)}
          className="search"
          autoComplete="off"
        />
        <input
          type="submit"
          className="btn btn-primary search"
          value="Search"
        />
        <input
          type="button"
          className="btn btn-primary"
          value="Get All Data"
          onClick={() => (window.location = "/")}
        />
      </form>
      <hr />

      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone_No</th>
            <th>Blood_Group</th>
            <th>District</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>{userDatas()}</tbody>
      </table>
      {data.length == 0 ? <h3 className="error">The List Is Empty</h3> : null}
    </div>
  );
};

export default Home;
