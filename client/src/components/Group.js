import React, { useState } from "react";
import Modals from "./Modals";

const Group = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onClick = () => {
    console.log("clicked");
    setModalIsOpen(true);
    console.log(modalIsOpen);
    return <Modals open={modalIsOpen} />;
  };
  return (
    <tr>
      <td>{props.myItem.name}</td>
      <td> {props.myItem.email} </td>
      <td>{props.myItem.phone} </td>
      <td>{props.myItem.blood_group}</td>
      <td>{props.myItem.district}</td>
      <td>
        <button className="btn btn-outline-danger" onClick={() => onClick()}>
          delete
        </button>
      </td>
      {modalIsOpen ? (
        <Modals
          open={modalIsOpen}
          change={setModalIsOpen}
          id={props.myItem._id}
        />
      ) : null}
    </tr>
  );
};

export default Group;
