import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";



const CatNextArrow = ({ onClick }) => {
  return (
    <div className="arrow catnext" onClick={onClick}>
      <IoIosArrowForward style={{ color: "#E9B926" }} />
    </div>
  );
};

const CatPrevArrow = ({ onClick }) => {
  return (
    <div className="arrow catprev" onClick={onClick}>
      <IoIosArrowBack style={{ color: "#E9B926" }} />
    </div>
  );
};

export { CatNextArrow, CatPrevArrow };
