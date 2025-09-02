import { API_URL } from '../service/api';
import axios from 'axios';
import {
  GET_CATEGORY,
} from './actionType';
import { toast } from 'react-toastify';

// Flag to prevent duplicate API calls
let isFetching = false;

export const getCategory = () => {
  return dispatch => {
    // Prevent duplicate API calls
    if (isFetching) {
      return;
    }
    
    isFetching = true;
    
    axios.get(`${API_URL}/admin/category/category`)
      .then(response => {
        const { data: { message, statusCode } = {} } = response;
        if (statusCode === 200) {
          // Check for duplicates in the API response
          if (response.data.result && response.data.result.category) {
            const categories = response.data.result.category;
            const uniqueCategories = categories.filter((cat, index, self) => 
              index === self.findIndex(c => c._id === cat._id)
            );
            
            if (uniqueCategories.length !== categories.length) {
              response.data.result.category = uniqueCategories;
            }
          }
          
          dispatch({
            type: GET_CATEGORY,
            payload: response.data.result
          });
          // toast.success(message);
        } else {
          toast.error("category is missing in req" + message);
        }
      })
      .catch(error => {
        if (error.response) {
          const { data: { message } } = error.response;
          toast.error(message);
        } else {
          return error
        }
      })
      .finally(() => {
        isFetching = false;
      });
  };
};