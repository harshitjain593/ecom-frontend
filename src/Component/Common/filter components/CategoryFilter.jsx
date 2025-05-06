import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../action/categoryAction";
import './filtercomp.css'

const CategoryFilter = ({ setCategoryFilter, searchQuery }) => {
  const dispatch = useDispatch();
  const categoriesMain = useSelector(state => state.categories?.categories?.category);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (!categoriesMain || categoriesMain.length === 0) {
      dispatch(getCategory());
    } else {
      setCategories(categoriesMain);
    }
  }, [dispatch, categoriesMain]);

  const filterCategories = useCallback(() => {
    if (searchQuery) {
      const filtered = categoriesMain.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCategories(filtered);
    } else {
      setCategories(categoriesMain);
    }
  }, [categoriesMain, searchQuery]);

  useEffect(() => {
    filterCategories();
  }, [filterCategories]);

  const handleCategoryChange = (categoryName) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryName)) {
      updatedCategories = selectedCategories.filter(name => name !== categoryName);
    } else {
      
      updatedCategories = [...selectedCategories, categoryName];
    }
    setSelectedCategories(updatedCategories);
    setCategoryFilter(updatedCategories);
    setCategoryFilter(updatedCategories); // Update the parent component with the selected categories
  };
  
  return (
    <>
      <div className="category-filter">
        {categories && categories.length > 0 ? (
          categories.map(category => (
            <div key={category._id} className="category-card">
              <div className="d-flex justify-content-start align-items-center gap-2  mt-4">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                />
                <label className="" style={{fontSize:'1rem'}} htmlFor={category.name}>{category.name}</label>
              </div>
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </>
  );
};

export default CategoryFilter;
