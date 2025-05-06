import React, { useState, useEffect } from "react";
import './filtercomp.css'; // Ensure to create and import the corresponding CSS file

const PriceFilter = (props) => {
  const {minPrice,setMinPrice,maxPrice,setMaxPrice} = props

  useEffect(() => {
   
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  return (
    <div className="price-filter">
        <div className="d-flex justify-content-center">
            <label className="fs-5 text-center  mt-4 mb-4">Price Range</label>
        </div>
      <div className="range-container ">
        <div className="d-flex flex-column  w-full">
            <label htmlFor="minRange">Min: ₹{minPrice}</label>
            <input
            type="range"
            min="0"
            max="9500"
            value={minPrice}
            onChange={handleMinChange}
            className="range-input"
            />
        </div>
        <div className="d-flex flex-column  w-full">
            <label htmlFor="maxRange">Max: ₹{maxPrice}</label>
            <input
            type="range"
            min="500"
            max="10000"
            value={maxPrice}
            onChange={handleMaxChange}
            className="range-input"
            />

        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
