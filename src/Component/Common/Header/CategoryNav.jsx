import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getCategoriesList,
  getActiveSubcategories,
  getSubcategoryName,
  isActiveCatalogItem,
} from '../../../utils/categoryUtils';
import './categoryNav.css';

const CategoryNav = () => {
  const categoriesState = useSelector((state) => state.categories);
  const categories = useMemo(
    () => getCategoriesList(categoriesState).filter(isActiveCatalogItem),
    [categoriesState]
  );
  const [activeCategory, setActiveCategory] = useState(null);

  if (!categories.length) return null;

  return (
    <nav className="category-nav d-none d-lg-block">
      <div className="category-nav__inner">
        <ul className="category-nav__list">
          {categories.map((category) => {
            const subcategories = getActiveSubcategories(category);
            const isActive = activeCategory === category._id;

            return (
              <li
                key={category._id || category.name}
                className={`category-nav__item ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveCategory(category._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link to={`/category/${category.name}`} className="category-nav__link">
                  {category.name}
                </Link>

                {subcategories.length > 0 && isActive && (
                  <div className="category-nav__dropdown">
                    <p className="category-nav__dropdown-title">{category.name}</p>
                    <ul className="category-nav__dropdown-list">
                      {subcategories.map((sub) => {
                        const subName = getSubcategoryName(sub);
                        if (!subName) return null;

                        return (
                          <li key={sub._id || subName}>
                            <Link
                              to={`/category/${encodeURIComponent(category.name)}?sub_category=${encodeURIComponent(subName)}`}
                              className="category-nav__dropdown-link"
                            >
                              {subName}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <Link
                      to={`/category/${category.name}`}
                      className="category-nav__view-all"
                    >
                      View all {category.name}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
          <li className="category-nav__item">
            <Link to="/shop" className="category-nav__link category-nav__link--shop">
              Shop All
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;
