import { API_URL } from '../service/api';
import axios from 'axios';
import {
  GET_CATEGORY,
} from './actionType';
import { toast } from 'react-toastify';


export const getCategory = () => {
  return dispatch => {
    axios.get(`${API_URL}/admin/category/category`)
      .then(response => {
        const { data: { message, statusCode } = {} } = response;
        if (statusCode === 200) {
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
      });
  };
};