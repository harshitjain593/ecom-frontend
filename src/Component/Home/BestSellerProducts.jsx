import React from "react";
import { useSelector } from "react-redux";
import Sliders from "./Sliders";

const BestSellerProducts = () => {
  const bestSellers = useSelector(state=>state.bestProducts?.products?.bestSellingProducts)
  
  console.log(bestSellers,'besssssssssty')
  if(!bestSellers){
    return <div className="loader"></div>
  }

  return (
    <section className="container-fluid home-slider-bottom "  >
    <div>
      <h2 className="fw-bold h3Tag pt-2">
       Best Sellers
      </h2>
    </div>
   <Sliders products={bestSellers}/>
  </section>
  )
};

export default BestSellerProducts;
