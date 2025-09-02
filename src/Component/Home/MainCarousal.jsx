import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip'; // Import the flip effect CSS

import { Navigation, Pagination,Autoplay } from 'swiper/modules';


const MainCarousel = ({ data }) => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1} // Full width carousel
      navigation={true} // Enable navigation buttons
      pagination={{ clickable: true }} // Enable pagination
      loop={true} // Enable looping
      autoplay={{ delay: 3000, disableOnInteraction: false }} // Enable autoplay with delay
      modules={[Navigation, Pagination, Autoplay]} // Include necessary modules
      style={{ width: '100%', height: '100%' }} // Ensure full width and height
    >
      {data && 
        data.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.image}
              alt={`Banner ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '500px', // Fixed height
                objectFit: 'cover', // Changed from 'contain' back to 'cover'
                objectPosition: 'center' // Center the image
              }}
            />
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};



export default MainCarousel;
