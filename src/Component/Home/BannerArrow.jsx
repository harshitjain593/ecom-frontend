import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const BArrow = ({ onClick, direction }) => {
  const isNext = direction === 'next';
  return (
    <div
      className={`b-arrow ${direction}`}
      onClick={onClick}
      style={{ [isNext ? 'right' : 'left']: '30px' }}
    >
      {isNext ? (
        <IoIosArrowForward size={30} style={{ color: "#E9B926" }} />
      ) : (
        <IoIosArrowBack size={30} style={{ color: "#E9B926" }} />
      )}
    </div>
  );
};

export default BArrow;