import React, { useEffect } from "react";
import Sliders from "./Sliders";
import { useDispatch, useSelector } from "react-redux";
import { newProducts } from "../../action/productdetailaction";

const PopularProducts = () => {
  const dispatch = useDispatch();
  const popularProducts = useSelector(state => state.bestProducts?.products?.popularProduct);

  useEffect(() => {
    if (!popularProducts) {
      dispatch(newProducts());
    }
  }, [dispatch, popularProducts]);

  if (!popularProducts) {
    return <div className="loader"></div>;
  }

  return (
    <section className="container-fluid">
      <div>
        <h2 className="fw-bold h3Tag">Popular Products</h2>
      </div>
      <Sliders products={popularProducts} />
    </section>
  );
}

export default PopularProducts;
