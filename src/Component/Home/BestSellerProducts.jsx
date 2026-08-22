import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sliders from "./Sliders";
import { newProducts } from "../../action/productdetailaction";
import './homeTheme.css';

const BestSellerProducts = () => {
  const dispatch = useDispatch();
  const bestSellers = useSelector(state => state.bestProducts?.products?.bestSellingProducts);

  useEffect(() => {
    dispatch(newProducts());
  }, [dispatch]);

  if (!bestSellers) {
    return <div className="loader" />;
  }

  return (
    <section className="home-section product-section" style={{ background: 'var(--oluxe-cream)' }}>
      <div className="home-container">
        <h2 className="home-section-title">Best Sellers</h2>
        <Sliders products={bestSellers} />
      </div>
    </section>
  );
};

export default BestSellerProducts;
