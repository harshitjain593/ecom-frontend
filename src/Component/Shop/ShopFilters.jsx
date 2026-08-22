import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../../action/categoryAction';
import {
  getActiveSubcategories,
  getCategoriesList,
  getSubcategoryName,
} from '../../utils/categoryUtils';

const ShopFilters = ({
  selectedCategories,
  onCategoryChange,
  activeSubCategory,
  currentCategorySlug,
}) => {
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
  const categories = getCategoriesList(categoriesState);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategory());
    }
  }, [dispatch, categories.length]);

  const filtered = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (name) => {
    if (selectedCategories.includes(name)) {
      onCategoryChange(selectedCategories.filter((item) => item !== name));
    } else {
      onCategoryChange([...selectedCategories, name]);
    }
  };

  const isSubActive = (subName) => {
    if (!activeSubCategory) return false;
    return (
      decodeURIComponent(activeSubCategory).toLowerCase() === subName.toLowerCase()
    );
  };

  return (
    <div className="shop-filters">
      <h3 className="shop-filters__title">Categories</h3>
      <input
        type="text"
        className="shop-filters__search"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="shop-filters__list">
        {filtered.length > 0 ? (
          filtered.map((category) => {
            const subcategories = getActiveSubcategories(category);
            const showSubs =
              subcategories.length > 0 &&
              (currentCategorySlug
                ? decodeURIComponent(currentCategorySlug).toLowerCase() ===
                  category.name?.toLowerCase()
                : selectedCategories.includes(category.name));

            return (
              <div key={category._id || category.name} className="shop-filters__group">
                <label className="shop-filters__item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                  />
                  <span>{category.name}</span>
                </label>

                {showSubs && (
                  <div className="shop-filters__sublist">
                    <Link
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className={`shop-filters__sublink${
                        !activeSubCategory ? ' is-active' : ''
                      }`}
                    >
                      All
                    </Link>
                    {subcategories.map((sub) => {
                      const subName = getSubcategoryName(sub);
                      if (!subName) return null;

                      return (
                        <Link
                          key={sub._id || subName}
                          to={`/category/${encodeURIComponent(category.name)}?sub_category=${encodeURIComponent(subName)}`}
                          className={`shop-filters__sublink${
                            isSubActive(subName) ? ' is-active' : ''
                          }`}
                        >
                          {subName}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="shop-filters__empty">No categories found</p>
        )}
      </div>
      {selectedCategories.length > 0 && (
        <button
          type="button"
          className="shop-filters__clear"
          onClick={() => onCategoryChange([])}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default ShopFilters;
