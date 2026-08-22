import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategoriesList,
  getSubcategories,
  getSubcategoryName,
} from '../../../utils/categoryUtils';
import './mobileCategoryMenu.css';

const MobileCategoryMenu = ({ categoriesState }) => {
  const categories = getCategoriesList(categoriesState);
  const [openCategory, setOpenCategory] = useState(null);

  if (!categories.length) return null;

  const toggleCategory = (id) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mobile-category-menu">
      <p className="mobile-category-menu__heading">Categories</p>
      <ul className="mobile-category-menu__list">
        {categories.map((category) => {
          const subcategories = getSubcategories(category);
          const isOpen = openCategory === category._id;

          return (
            <li key={category._id || category.name} className="mobile-category-menu__item">
              <div className="mobile-category-menu__row">
                <Link
                  to={`/category/${category.name}`}
                  className="mobile-category-menu__link"
                >
                  {category.name}
                </Link>
                {subcategories.length > 0 && (
                  <button
                    type="button"
                    className="mobile-category-menu__toggle"
                    onClick={() => toggleCategory(category._id)}
                    aria-label={`Toggle ${category.name} subcategories`}
                  >
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} />
                  </button>
                )}
              </div>
              {isOpen && subcategories.length > 0 && (
                <ul className="mobile-category-menu__sublist">
                  {subcategories.map((sub) => {
                    const subName = getSubcategoryName(sub);
                    if (!subName) return null;

                    return (
                      <li key={sub._id || subName}>
                        <Link
                          to={`/category/${encodeURIComponent(category.name)}?sub_category=${encodeURIComponent(subName)}`}
                          className="mobile-category-menu__sublink"
                        >
                          {subName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
        <li className="mobile-category-menu__item">
          <Link to="/shop" className="mobile-category-menu__link mobile-category-menu__link--all">
            Shop All
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileCategoryMenu;
