import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './homeTheme.css';

const HERO_VIDEO = 'https://oluxe.s3.ap-south-1.amazonaws.com/IMG_7108.mp4';
const FALLBACK_IMAGE = '/img/home/bedroom-classic.jpg';

const HeroVideo = () => {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <section className="hero-video">
      <div className="hero-video__media">
        {!useFallback ? (
          <video
            className="hero-video__element"
            autoPlay
            muted
            loop
            playsInline
            poster={FALLBACK_IMAGE}
            onError={() => setUseFallback(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img src={FALLBACK_IMAGE} alt="Oluxe handcrafted rugs" className="hero-video__element" />
        )}
        <div className="hero-video__overlay" />
      </div>
      <div className="hero-video__content">
        <p className="hero-video__eyebrow">Est. 2018 · Panipat, India</p>
        <h1 className="hero-video__title">Handcrafted Rugs for Modern Homes</h1>
        <p className="hero-video__desc">
          Contemporary carpets designed with intention — texture, tone, and timeless craftsmanship.
        </p>
        <Link to="/shop" className="home-btn home-btn--outline">Shop Collection</Link>
      </div>
    </section>
  );
};

export default HeroVideo;
