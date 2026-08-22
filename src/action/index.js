import axios from 'axios';
import {
  FETCH_DATA_SUCCESS, FETCH_PRODUCT_SUCCESS
} from './actionType';
import { API_URL } from '../service/api';

export const fetchImages = () => {
  return dispatch => {
    axios.get(`${API_URL}/admin/banner/home-page-banner`)
    .then(response => {
       dispatch({
        type: FETCH_DATA_SUCCESS,
        payload: response.data.result 
      })
      

    })
  };
};


export const fetchProduct = () => {
  return async (dispatch) => {
    try {
      // Public storefront catalog — same endpoint category/shop filters use.
      // Avoid /admin/product/products: it rejects customer/expired tokens with 401.
      const response = await axios.get(`${API_URL}/mobileApi/product/filter-product`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { statusCode, result } = response.data || {};
      if (statusCode === 200) {
        dispatch({
          type: FETCH_PRODUCT_SUCCESS,
          payload: {
            result: {
              products: result?.products || [],
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
};
