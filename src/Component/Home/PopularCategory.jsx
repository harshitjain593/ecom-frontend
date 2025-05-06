import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './index.css';


function PopularCategory() {

  const slider = useRef();
  const setting = {
    infinite: true,
    speed: 400,
    autoplay: true,
    slidesToShow: 7,
    arrows: false,
    slidesToScroll: 1,
    dots: true,


    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
          autoplay: true,
          infinite: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
          autoplay: true,
          infinite: true,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          autoplay: true,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          autoplay: true,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className='container-fluid py-4'>
      <div>
        <h2 className='fw-bold fs-3' style={{ color: "#6B6363" }}>Our Product</h2>
      </div>
      <div>
        <Slider ref={slider} {...setting} className="">
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/3_Nestasia_Plates_Platters_6773f99c-4016-4f87-8617-f22892f839e5.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bowl</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/4_Nestasia_Glassware_d33186eb-3842-4f02-9752-8c009c24c043.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Glassware</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/5_Nestasia_Decor_e3780cab-7a39-411b-b917-b41e76502dbe.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Decor</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/5_Nestasia_Decor_e3780cab-7a39-411b-b917-b41e76502dbe.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bath</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/7_Nestasia_Bath_7ce42bfd-14ae-4e01-bada-8a44ca31ff0e.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Dinner Set</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/8_Nestasia_Soft_Furnishings_5acf50c7-2a07-4fd0-9f13-50d9a9976068.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bowl</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/1_Nestasia_Bowl_7d124dbf-4521-4b1d-bd4f-2dfe98bf022c.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bowl</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/2_Nestasia_drinkware_6416d56e-e138-4f97-8ce0-d319ce95eb75.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bowl</p>
          </div>
          <div className='px-4'>
            <img src="https://nestasia.in/cdn/shop/files/3_Nestasia_Plates_Platters_6773f99c-4016-4f87-8617-f22892f839e5.jpg?v=1715231869&width=128" alt="" />
            <p className='text-center text-capitalize'>Bowl</p>
          </div>
        </Slider>
      </div>
    </section>
  )
}

export default PopularCategory;
