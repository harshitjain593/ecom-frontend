import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../../action/categoryAction';
import { getCategoriesList } from '../../utils/categoryUtils';

const ShopFilters = ({ selectedCategories, onCategoryChange }) => {
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
          filtered.map((category) => (
            <label key={category._id || category.name} className="shop-filters__item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => toggleCategory(category.name)}
              />
              <span>{category.name}</span>
            </label>
          ))
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
