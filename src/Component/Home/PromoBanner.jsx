import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './homeTheme.css';

const PromoBanner = () => {
  const banners = useSelector((state) => state.data?.data);

  if (!banners || !banners.length) return null;

  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <section className="home-section promo-banner">
        <div className="promo-banner__single">
          <img src={banner.image} alt="Oluxe promotion" className="promo-banner__image" />
          <div className="promo-banner__overlay">
            <p className="promo-banner__eyebrow">New Collection</p>
            <h2 className="promo-banner__title">Discover Handcrafted Elegance</h2>
            <Link to="/shop" className="home-btn home-btn--outline">Explore Now</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section promo-banner">
      <div className="home-container">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="promo-banner__swiper"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id || index}>
              <div className="promo-banner__slide">
                <img src={banner.image} alt={`Promotion ${index + 1}`} className="promo-banner__image" />
                <div className="promo-banner__overlay promo-banner__overlay--center">
                  <Link to="/shop" className="home-btn home-btn--outline">Shop Collection</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PromoBanner;
