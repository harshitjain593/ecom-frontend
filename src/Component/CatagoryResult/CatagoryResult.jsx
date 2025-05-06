import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../SearchResult/searchResult.css';
import { FaRegStarHalfStroke as HalfStar } from "react-icons/fa6";
import { FaStar as FullStar } from "react-icons/fa6";
import { FaRegStar as EmptyStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Sliders from "../Home/Sliders";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../service/api";
import { filterProducts } from "../../action/filterAction";
import ProductSlider from "../product slider/ProductSlider";
import ComparePOPup from "../comparePOPup/ComparePOPup";
import useLocal from "../../service/compare";
import FilterSidebar from "../sidebar/FilterSidebar";



    {/* // relatedProducts.map(product => (
                            //     <main key={product._id}>
                            //         <div className="s-pic-container">
                            //             <img src={product.productImage} alt="blank" />
                            //         </div>
                            //         <div className="s-text-main-container">
                            //             <div className="s-text-container">
                            //                 <Link>{product.product_name}</Link>
                            //                 <div className="rating">
                            //                     <div>
                            //                         Rating: <FullStar size={18} /> 5
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //             <div className="s-price-details-container">
                            //                 <div>
                            //                     <h5 className="fs-md-3">₹{product.selling_price}</h5>
                            //                     <h6 className="text-muted">M.R.P ₹{product.mrp_price}</h6>
                            //                     <h6>
                            //                         <span style={{ fontWeight: 500 }} className="text-success">
                            //                             Save {((product.mrp_price - product.selling_price) / product.mrp_price * 100).toFixed(2)}%
                            //                         </span>
                            //                     </h6>
                            //                 </div>
                            //             </div>
                            //             <div className="s-button-container">
                            //                 <button>add to cart</button>
                            //                 <button>wishlist <FaRegHeart /></button>
                            //             </div>
                            //         </div>
                            //     </main>
                            // )) */}

const CategoryResult = () => {

    const products = useSelector(state => state.filteredProducts?.products?.products);
    const compareProducts = useSelector(state=>state.compare.data)
    const loading = useSelector(state=>state.filterProducts?.loading)
    const opensidebar = useSelector(state=>state.filterData.sidebarOpen);


    return (
        <>
            {loading ? (
                <div className="loader"></div>
            ) : (
                <section>
                 
                    <div className="d-flex position-relative">
                       {opensidebar&& <FilterSidebar/>}
                        {products && products.length > 0 ? (
                            <>
                         
                            
                              <div className="s-container">

                              <ProductSlider products={products}/>
                              </div>
                              
                       
                        
                            {compareProducts.products.length>0&&

                            <ComparePOPup products={compareProducts.products}/>
                            }
                            </>
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                    {/* <div className="mx-4">
                        <Sliders products={allProducts} />
                    </div> */}
                </section>
            )}
        </>
    );
};

export default CategoryResult;
