import { API_URL } from '../service/api';
import axios from 'axios';
import { GET_CATEGORY } from './actionType';
import { toast } from 'react-toastify';
import {
  extractCategoryList,
  extractSubcategoryList,
  mergeSubcategoriesIntoCategories,
} from '../utils/categoryUtils';

const isApiSuccess = (data) =>
  data?.statusCode === 200 || data?.code === 1;

const dedupeCategories = (categories) =>
  categories.filter(
    (cat, index, self) => index === self.findIndex((c) => c._id === cat._id)
  );

const fetchJson = async (url) => {
  const response = await axios.get(url);
  const data = response?.data;
  if (!isApiSuccess(data)) return null;
  return data.result;
};

export const getCategory = () => {
  return async (dispatch) => {
    try {
      const [categoryResult, subcategoryResult] = await Promise.allSettled([
        fetchJson(`${API_URL}/admin/category/category`),
        fetchJson(`${API_URL}/admin/subcategory/subcategory`),
      ]);

      let categories = [];
      let flatSubcategories = [];

      if (categoryResult.status === 'fulfilled' && categoryResult.value) {
        categories = extractCategoryList(categoryResult.value);
        flatSubcategories = extractSubcategoryList(categoryResult.value);
      }

      if (subcategoryResult.status === 'fulfilled' && subcategoryResult.value) {
        const fromSubEndpoint = extractSubcategoryList(subcategoryResult.value);
        if (fromSubEndpoint.length) {
          flatSubcategories = [...flatSubcategories, ...fromSubEndpoint];
        }
        if (!categories.length) {
          categories = extractCategoryList(subcategoryResult.value);
        }
      }

      categories = dedupeCategories(categories);
      categories = mergeSubcategoriesIntoCategories(categories, flatSubcategories);

      dispatch({
        type: GET_CATEGORY,
        payload: { category: categories },
      });
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      console.error('getCategory error:', error);
    }
  };
};
