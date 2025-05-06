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
  return dispatch => {
    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/admin/product/products`,{
      headers: {
        ...(token&&{'Authorization':`Bearer ${token}`}),
        'Content-Type':'application/json'
      }
    })
      .then(response => {
        dispatch({
          type: FETCH_PRODUCT_SUCCESS,
          payload: response.data
        });
      })
  };
};
