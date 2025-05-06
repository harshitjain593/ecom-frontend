import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from '../Home/Arrow';
import { Link } from 'react-router-dom';
// import './index.css' // Import custom arrow components


function Shopproduct() {

  const slider = useRef();
  const setting = {
    infinite: true,
    speed: 400,
    autoplay: false,
    slidesToShow: 3,
    arrows: true, // Enable arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          autoplay: false,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
      <section className="px-3 py-1">
        <div>
          <h2 className='fw-bold fs-3 px-2' style={{ color: "#6B6363" }}>Exclusive Product</h2>
        </div>
        <Slider ref={slider} {...setting} className="">
          <div className="px-2">
            <div className="slide-sec">
              <img src="https://cdn.shopify.com/s/files/1/2690/0106/files/DSC6396_360x.jpg?v=1686568571" alt="" style={{ height: "400px" }} />
              <div className="info">
                <Link to="/productdetail"><aside className="px-2 py-1 text-dark">Taper Candle Stand Gold Set Of 3</aside></Link>
                <span className="px-2">₹ 1,610</span>
              </div>
              <div className="buttons1">
                <span >Small</span>
                <span>Medium</span>
                <span>Large</span>
                {/* <span>Customize</span> */}
              </div>
              <div className="buttons" >
                <button className='text-danger' style={{ borderRight: "#E1AB0A" }}>Add to Cart</button>
                <button className='text-success' style={{ borderLeft: "#E1AB0A" }}>Buy Now</button>
              </div>
            </div>
          </div>
          <div className="px-2">
            <div className="slide-sec">
              <img src="https://cdn.shopify.com/s/files/1/2690/0106/files/servingbowlset_4_360x.jpg?v=1713351955" alt="" style={{ height: "400px" }} />
              <div className="info">
                <Link to="/productdetail"> <aside className="px-2 py-1 text-dark">Set Of 2 Dandelion Serving Bowls 1650ml</aside></Link>
                <span className="px-2">₹ 2,010</span>
              </div>
              <div className="buttons1">
                <span >Small</span>
                <span>Medium</span>
                <span>Large</span>
                {/* <span>Customize</span> */}
              </div>
              <div className="buttons" >
                <button className='text-danger' style={{ borderRight: "#E1AB0A" }}>Add to Cart</button>
                <button className='text-success' style={{ borderLeft: "#E1AB0A" }}>Buy Now</button>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="slide-sec">
              <img src="https://cdn.shopify.com/s/files/1/2690/0106/products/CSC_1636_f2b6bc97-abed-4660-bab6-9c0d6b2def73_360x.jpg?v=1663678696" alt="" style={{ height: "400px" }} />
              <div className="info">
                <Link to="/productdetail"><aside className="px-2 py-1 text-dark">Gold Rim Crystal Bowls Tray Set Of 5 200ml</aside></Link>
                <span className="px-2">₹ 2,010</span>
              </div>
              <div className="buttons1">
                <span >Small</span>
                <span>Medium</span>
                <span>Large</span>
                {/* <span>Customize</span> */}
              </div>
              <div className="buttons" >
                <button className='text-danger' style={{ borderRight: "#E1AB0A" }}>Add to Cart</button>
                <button className='text-success' style={{ borderLeft: "#E1AB0A" }}>Buy Now</button>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="slide-sec">
              <img src="https://cdn.shopify.com/s/files/1/2690/0106/products/DSCF7539_360x.jpg?v=1679655059" alt="" style={{ height: "400px" }} />
              <div className="info">
                <Link to="productdetail"><aside className="px-2 py-1 text-dar">Aloha Soup Bowl 280 ml Set Of 6</aside></Link>
                <span className="px-2">₹ 1,310</span>
              </div>
              <div className="buttons1">
                <span >Small</span>
                <span>Medium</span>
                <span>Large</span>
                {/* <span>Customize</span> */}
              </div>
              <div className="buttons" >
                <button className='text-danger' style={{ borderRight: "#E1AB0A" }}>Add to Cart</button>
                <button className='text-success' style={{ borderLeft: "#E1AB0A" }}>Buy Now</button>
              </div>
            </div>
          </div>

          <div className="px-2">
            <div className="slide-sec">
              <img src="https://cdn.shopify.com/s/files/1/2690/0106/products/WXNU85_1_360x.jpg?v=1657601866" alt="" style={{ height: "400px" }} />
              <div className="info">
                <Link to='productdetail'><aside className="px-2 py-1 text-dark">Candle Stand</aside></Link>
                <span className="px-2">₹ 1,910</span>
              </div>
              <div className="buttons1">
                <span >Small</span>
                <span>Medium</span>
                <span>Large</span>
                {/* <span>Customize</span> */}
              </div>
              <div className="buttons" >
                <button className='text-danger' style={{ borderRight: "#E1AB0A" }}>Add to Cart</button>
                <button className='text-success' style={{ borderLeft: "#E1AB0A" }}>Buy Now</button>
              </div>
            </div>
          </div>
        </Slider>
      </section>
    </>
  );
}
export default Shopproduct;
