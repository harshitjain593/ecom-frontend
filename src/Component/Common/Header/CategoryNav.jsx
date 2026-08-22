import React from 'react';
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
  const categories = getCategoriesList(categoriesState).filter(isActiveCatalogItem);

  if (!categories.length) return null;

  return (
    <nav className="category-nav d-none d-lg-block">
      <div className="category-nav__inner">
        <ul className="category-nav__list">
          {categories.map((category) => {
            const subcategories = getActiveSubcategories(category);
            const categoryKey = category._id || category.name;

            return (
              <li
                key={categoryKey}
                className="category-nav__item"
              >
                <Link
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="category-nav__link"
                >
                  {category.name}
                </Link>

                {subcategories.length > 0 && (
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
                      to={`/category/${encodeURIComponent(category.name)}`}
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
