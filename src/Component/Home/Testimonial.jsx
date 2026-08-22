import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from './Arrow';
import './homeTheme.css';

const TESTIMONIALS = [
  {
    quote: 'The rug transformed our living room completely. The quality is exceptional — you can feel the craftsmanship in every thread. Oluxe delivered exactly what we envisioned.',
    author: 'Priya Sharma',
  },
  {
    quote: 'We ordered a custom-sized rug for our bedroom and the finish is flawless. The colours are even more beautiful in person. Truly a piece of art for the floor.',
    author: 'Rahul Mehta',
  },
  {
    quote: 'From browsing to delivery, the experience was seamless. The rug anchors our dining space perfectly. I have already recommended Oluxe to friends and family.',
    author: 'Ananya Kapoor',
  },
];

function Testimonial() {
  const slider = useRef();
  const setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
  };

  return (
    <section className="home-section testimonial-section">
      <div className="home-container">
        <h2 className="home-section-title">What Our Clients Say</h2>
        <Slider ref={slider} {...setting}>
          {TESTIMONIALS.map((item) => (
            <div key={item.author} className="testimonial-slide">
              <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
              <p className="testimonial-author">{item.author}</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonial;
