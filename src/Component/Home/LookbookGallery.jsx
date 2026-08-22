import React from 'react';
import './homeTheme.css';

const LOOKBOOK_IMAGES = [
  { src: '/img/home/lifestyle-cozy.jpg', alt: 'Cozy living with Oluxe rug' },
  { src: '/img/home/bedroom-modern.jpg', alt: 'Modern bedroom with abstract rug' },
  { src: '/img/home/living-topdown.jpg', alt: 'Living room aerial view' },
  { src: '/img/home/living-bohemian.jpg', alt: 'Bohemian living space' },
  { src: '/img/home/bedroom-classic.jpg', alt: 'Classic bedroom with patterned rug' },
];

const LookbookGallery = () => (
  <section className="home-section lookbook-gallery">
    <div className="home-container">
      <h2 className="home-section-title">Styled by Oluxe</h2>
      <p className="home-section-subtitle">
        Inspiration for every corner of your home.
      </p>
      <div className="lookbook-gallery__grid">
        {LOOKBOOK_IMAGES.map((item, index) => (
          <div
            key={item.src}
            className={`lookbook-gallery__item lookbook-gallery__item--${index + 1}`}
          >
            <img src={item.src} alt={item.alt} className="lookbook-gallery__img" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LookbookGallery;
