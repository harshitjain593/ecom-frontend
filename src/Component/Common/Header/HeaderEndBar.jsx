import React, { useMemo } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HeaderEndBar = () => {
  const category = useSelector(state => state.categories)
  
  // Deduplicate categories using useMemo for better performance
  const uniqueCategories = useMemo(() => {
    if (!category?.categories?.category) return [];
    
    const categories = category.categories.category;
    
    // Create a Map to ensure uniqueness by _id
    const uniqueMap = new Map();
    
    categories.forEach(cat => {
      if (cat && cat._id && cat.name) {
        // If we already have this category, skip it
        if (uniqueMap.has(cat._id)) {
          return;
        }
        uniqueMap.set(cat._id, cat);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [category]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 0,
    autoplay: false,
    slidesToShow: 13,
    slidesToScroll: 0,
    arrows: false,
    swipe: false,
    touchMove: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 13,
          slidesToScroll: 0,
          autoplay: false,
          infinite: false,
          arrows: false,
          swipe: false,
          touchMove: false,
          draggable: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 10,
          slidesToScroll: 0,
          autoplay: false,
          infinite: false,
          arrows: false,
          swipe: false,
          touchMove: false,
          draggable: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 0,
          autoplay: false,
          infinite: false,
          arrows: false,
          swipe: false,
          touchMove: false,
          draggable: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          initialSlide: 0,
          arrows: false,
          swipe: true,
          touchMove: true,
          draggable: true,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          autoplay: true,
          autoplaySpeed: 3000,
          slidesToScroll: 1,
          arrows: false,
          swipe: true,
          touchMove: true,
          draggable: true,
          infinite: true,
        },
      },
    ],
  };

  // Don't render if no categories are available
  if (!category || !category.categories || !category.categories.category) {
    return null;
  }

  return (
    <>
      <div className="header-slider">
        {uniqueCategories && uniqueCategories.length > 0 ? (
          <Slider {...settings}>
            {uniqueCategories.map((cat) => (
              <div className="dropdown drop-list position-static" key={cat._id}>
                <Link to={`/category/${cat.name}`} className="d-flex justify-content-center">
                  <img
                  className="nav-headend-img"
                    src={cat.image}
                    alt={cat.name}
                  
                  />
                </Link>
                <p
                 style={{ fontWeight:600}}
                  className="cat-title dropdown-arrow d-flex justify-content-center py-1 links text-dark font-weight-bold text-capitalize"
                >
                  {cat.name}
                </p>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center py-3">
            <p>Loading categories...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderEndBar;
