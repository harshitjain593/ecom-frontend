import React from 'react';
import './homeTheme.css';

const VALUES = [
  { icon: 'fa-truck', label: 'Free Shipping' },
  { icon: 'fa-shield-halved', label: 'Safe Payment' },
  { icon: 'fa-clock', label: 'On-time Delivery' },
  { icon: 'fa-flag', label: 'Made in India' },
];

const CraftValues = () => (
  <section className="home-section craft-values">
    <div className="home-container">
      <div className="craft-values__grid">
        {VALUES.map((item) => (
          <div key={item.label} className="craft-values__item">
            <i className={`fa-solid ${item.icon} craft-values__icon`} />
            <span className="craft-values__label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CraftValues;
