import React, { useState } from 'react';
import './homeTheme.css';

const SHOWCASE_VIDEO = 'https://oluxe.s3.ap-south-1.amazonaws.com/IMG_7029.mp4';
const FALLBACK_IMAGE = '/img/home/lifestyle-cozy.jpg';

const VideoShowcase = () => {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <section className="home-section video-showcase">
      <div className="home-container video-showcase__inner">
        <div className="video-showcase__media">
          {!useFallback ? (
            <video
              className="video-showcase__element"
              autoPlay
              muted
              loop
              playsInline
              poster={FALLBACK_IMAGE}
              onError={() => setUseFallback(true)}
            >
              <source src={SHOWCASE_VIDEO} type="video/mp4" />
            </video>
          ) : (
            <img src={FALLBACK_IMAGE} alt="Oluxe rug craftsmanship" className="video-showcase__element" />
          )}
        </div>
        <div className="video-showcase__content">
          <p className="video-showcase__eyebrow">The Oluxe Difference</p>
          <h2 className="video-showcase__title">Handcrafted in India</h2>
          <p className="video-showcase__text">
            Every Oluxe rug goes through meticulous finishing before it leaves our workshop.
            Decades of weaving expertise meet contemporary design — creating pieces worthy
            of becoming heirlooms.
          </p>
          <p className="video-showcase__text">
            With an emphasis on natural materials and uncompromising quality, we deliver
            refined carpets that anchor spaces with understated elegance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
