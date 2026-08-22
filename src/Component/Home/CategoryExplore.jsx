import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './homeTheme.css';

const ROOMS = [
  {
    title: 'Living Room',
    image: '/img/home/living-topdown.jpg',
    keywords: ['living', 'furniture', 'wooden'],
  },
  {
    title: 'Bedroom',
    image: '/img/home/bedroom-modern.jpg',
    keywords: ['bedroom', 'bed', 'wooden'],
  },
  {
    title: 'Dining Room',
    image: '/img/home/bedroom-classic.jpg',
    keywords: ['dining', 'ceramic', 'wooden'],
  },
];

const getCategoryLink = (room, categories) => {
  if (!categories?.length) return '/shop';

  const match = categories.find((cat) =>
    room.keywords.some((keyword) => cat.name?.toLowerCase().includes(keyword))
  );

  if (match) {
    return `/category/${match.name}`;
  }

  return '/shop';
};

const CategoryExplore = () => {
  const categories = useSelector((state) => state.categories?.categories?.category) || [];

  return (
    <section className="home-section category-explore">
      <div className="home-container">
        <h2 className="home-section-title">Choose by Space</h2>
        <p className="home-section-subtitle">
          Find the perfect rug for every room in your home.
        </p>
        <div className="category-explore__grid">
          {ROOMS.map((room) => (
            <Link
              key={room.title}
              to={getCategoryLink(room, categories)}
              className="category-explore__card"
            >
              <img src={room.image} alt={room.title} className="category-explore__img" />
              <div className="category-explore__overlay">
                <span className="category-explore__label">{room.title}</span>
                <span className="category-explore__cta">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryExplore;
