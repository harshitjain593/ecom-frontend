// Modal.js
import React from "react";
import '../Auth/Register/register.css'
import { IoMdClose } from "react-icons/io";

const Modal = ({ show, handleClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <section className="main-modal-cont position-absolute ">
      <div className="bg-danger text-white fs-4 ">
      <p className="">Please check you credentials</p>
      <IoMdClose size={30} onClick={handleClose}/>
      </div>
      <div className="mt-2 ">
        {children}
      </div>
    


    </section>
   
  );
};

export default Modal;
