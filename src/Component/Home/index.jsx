import React, { useCallback, useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import './homeTheme.css';
import { getCategory } from '../../action/categoryAction';
import { fetchImages } from '../../action/index';
import { getUser } from '../../action/authaction';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../service/api';
import HeroVideo from './HeroVideo';
import CategoryExplore from './CategoryExplore';
import Excusivecategory from './Excusivecategory';
import PromoBanner from './PromoBanner';
import BrandStory from './BrandStory';
import VideoShowcase from './VideoShowcase';
import BestSellerProducts from './BestSellerProducts';
import Sliders from './Sliders';
import LookbookGallery from './LookbookGallery';
import CraftValues from './CraftValues';
import Testimonial from './Testimonial';

function Home() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [recentProducts, setRecentProducts] = useState([]);

  const getRecent = useCallback(async () => {
    try {
      if (!token) return;

      const response = await axios.get(`${API_URL}/mobileApi/product/recently-view-product`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const { statusCode, message, result } = response.data;
      if (statusCode === 200) {
        setRecentProducts(result);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log('Error:', error, 'from jsx');
    }
  }, [token]);

  useEffect(() => {
    getRecent();
    dispatch(getUser());
    dispatch(getCategory());
    dispatch(fetchImages());
  }, [dispatch, getRecent]);

  return (
    <>
      <HeroVideo />
      <CategoryExplore />
      <Excusivecategory />
      <PromoBanner />
      <BrandStory />
      <VideoShowcase />
      {token && recentProducts.length > 0 && (
        <section className="home-section product-section">
          <div className="home-container">
            <h2 className="home-section-title">Recently Viewed</h2>
            <Sliders products={recentProducts} />
          </div>
        </section>
      )}
      <BestSellerProducts />
      <LookbookGallery />
      <CraftValues />
      <Testimonial />
    </>
  );
}

export default Home;
