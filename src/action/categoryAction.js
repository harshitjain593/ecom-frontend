import { API_URL } from '../service/api';
import axios from 'axios';
import { GET_CATEGORY } from './actionType';
import { toast } from 'react-toastify';
import { extractCategoryList } from '../utils/categoryUtils';

const isApiSuccess = (data) =>
  data?.statusCode === 200 || data?.code === 1;

const dedupeCategories = (categories) =>
  categories.filter(
    (cat, index, self) => index === self.findIndex((c) => c._id === cat._id)
  );

export const getCategory = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/admin/category/category`);
      const data = response?.data;

      if (!isApiSuccess(data)) {
        toast.error(data?.message || 'Failed to load categories');
        return;
      }

      const categories = dedupeCategories(extractCategoryList(data.result));

      dispatch({
        type: GET_CATEGORY,
        payload: {
          ...data.result,
          category: categories,
        },
      });
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      console.error('getCategory error:', error);
    }
  };
};
