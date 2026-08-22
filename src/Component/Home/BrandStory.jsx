import React from 'react';
import { Link } from 'react-router-dom';
import './homeTheme.css';

const BrandStory = () => (
  <section className="home-section brand-story" id="about">
    <div className="home-container brand-story__inner">
      <div className="brand-story__image-wrap">
        <img
          src="/img/home/living-bohemian.jpg"
          alt="Oluxe rug in a modern living space"
          className="brand-story__image"
        />
      </div>
      <div className="brand-story__content">
        <p className="brand-story__eyebrow">Our Story</p>
        <h2 className="brand-story__title">Crafted with Quiet Luxury</h2>
        <p className="brand-story__text">
          Oluxe crafts contemporary luxury rugs that balance sophistication with enduring quality.
          Designed in India and handcrafted in Panipat, Haryana, each piece is composed with
          attention to texture, tone, and longevity.
        </p>
        <p className="brand-story__text">
          We believe good design should feel effortless. From fibre selection to finishing,
          every rug is woven slowly — for those who seek subtle colour stories and objects
          with intention, not noise.
        </p>
        <Link to="/contact" className="home-btn">Learn More</Link>
      </div>
    </div>
  </section>
);

export default BrandStory;
