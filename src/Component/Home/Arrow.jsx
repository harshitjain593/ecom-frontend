import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";




const NextArrow = ({ onClick }) => {
  return (
    <div className="arrow next" onClick={onClick}>
      <IoIosArrowForward style={{ color: "#E9B926" }} />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div className="arrow prev" onClick={onClick}>
      <IoIosArrowBack style={{ color: "#E9B926" }} />
    </div>
  );
};

export { NextArrow, PrevArrow };
