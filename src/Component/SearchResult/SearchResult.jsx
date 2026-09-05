import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './searchResult.css'
import { FaRegStarHalfStroke as HalfStar } from "react-icons/fa6";
import { FaStar as FullStar} from "react-icons/fa6";
import { FaRegStar as EmptyStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import NoResults from "./NoResults";
import ProductSlider from "../product slider/ProductSlider";
import ComparePOPup from "../comparePOPup/ComparePOPup";
import useLocal from "../../service/compare";
import FilterSidebar from "../sidebar/FilterSidebar";

const SearchResult = () => {
    const param = useParams();
    const compareProductsmain =useSelector(state=>state?.compare?.data)
    const opensidebar = useSelector(state=>state.filterData.sidebarOpen);
    const [compareProducts,setCompareProducts] = useState([])
    useEffect(()=>{
        if(compareProductsmain){
            setCompareProducts(prev=>compareProductsmain.products)
        }

    },[compareProductsmain])
    const resultProducts = useSelector(state => state.filteredProducts?.products?.products) || [];
    console.log(resultProducts)
   if(resultProducts.length<1){
    return(
        <>
          <div className="notfound">
            <div className="text-center " style={{paddingTop:'0rem'}}>
                <img  className="noimg" src="/img/search-not-found.png"  alt="" />
                <h1 style={{margin:0, lineHeight:'15px'}} className="text-white">We couldn't find any matches!</h1>
                <p style={{fontSize:'.8rem' ,marginTop:'2rem', color:'white'}}>Please check the spelling or try searching something else</p>
            </div>
            <div>
                <NoResults/>
            </div>
          </div>
        </>
    )
   }


  return (
    <>
   <section className="position-relative d-flex">
    {/* <div className="first-box">
        <div className="fs-5 ml-4 ">Results for "{param.id}"</div>
    </div> */}
   {opensidebar && <FilterSidebar/>}
    <div className="s-container ">
        {resultProducts && <ProductSlider products={resultProducts}/>}
    {compareProducts.length >0 &&   <ComparePOPup products={compareProducts} />}
   
            
       
    </div>
    
   </section>
    </>
  )
};

export default SearchResult;
