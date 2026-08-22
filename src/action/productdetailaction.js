import { API_URL } from '../service/api';
import axios from 'axios';
import {
  ADD_TO_CART,
  ADD_TO_WISHLIST,
  BEST_PRODUCTS,
  GET_PRODUCT_DETAILS,
  GET_WISHLIST,
  UPDATE_CART,
} from './actionType';
import { ToastContainer, toast } from 'react-toastify';
import { type } from '@testing-library/user-event/dist/type';

export const addWishList = (productId) => {
  return async dispatch => {
    try {
      console.log('dispatched for add to wishlist');
      const token = localStorage.getItem('token');
      if (!token) {
        // toast.error("User is not authenticated");
        return;
      }
      const response = await fetch(`${API_URL}/mobileApi/wishlist/add-to-wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data wishlist', data);
        const { message, statusCode, result } = data;

        if (statusCode === 200) {
          // Dispatch the add to wishlist action with the new product as payload
          dispatch({ type: ADD_TO_WISHLIST, payload: result.products });
        
        } else {
         
        }
      } else {
        const errorData = await response.json();
        console.log('data', errorData);
    
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
     
    }
  };
};


export const addtoCart = ( productId,colorId=null, quantity=1 ) => {
  return async dispatch => {
    try {
    
     console.log('color', colorId)
      const token = localStorage.getItem('token');
      if (!token) {
        // toast.error("User is not authenticated");
        return;
      }
      const requestBody = {
        productId: productId,
        quantity: quantity,
        ...(colorId&&{colorOptionId:colorId})
      };
      const response = await fetch(`${API_URL}/mobileApi/cart/add-to-cart/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const { message, statusCode, result } = data;

        if (statusCode === 200) {
          dispatch({
            type: ADD_TO_CART,
            payload: {
              product: result.product, // Ensure the payload matches the reducer logic
              quantity: quantity,
            }
          });
          // toast.success(message);
        } else {
          toast.error("Failed to add to Cart: " + message);
        }
      } else {
        const errorData = await response.json();
        console.log('data', errorData);
        toast.error(errorData.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error("An unexpected error occurred");
    }
  };
};




export const updateCart = ({productId,colorId,quantity}) => {
  return async dispatch => {
    try {
      const token = localStorage.getItem('token');
      console.log('this token from addtocart',token)
      if (!token) {
        // toast.error("User is not authenticated");
        return;
      }
      const requestBody = {
        productId: productId,
        quantity:quantity,
        colorOptionId:colorId
      };
      console.log(requestBody, 'from the reqbody of update cart')
      const response = await fetch(`${API_URL}/mobileApi/cart/update-cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const { message, statusCode, result } = data;

        if (statusCode === 200) {
          dispatch({
            type:UPDATE_CART,
            payload:{ result,
              colorId:colorId
            }
          });
          // toast.success(message);
        } else {
          toast.error("Failed to add to Cart: " + message);
        }
      } else {
        const errorData = await response.json();
        console.log('data', errorData);
        toast.error(errorData.message || 'An unexpected error occurred ');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error("An unexpected error occurred");
    }
  };
};








export const getProductDetails = (id) => {

  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}/admin/product/product/${id}`,{
        headers: {
            'Content-Type': 'application/json'
        } 
      });
      const { data: { message, statusCode, result } = {} } = response;
      if (statusCode === 200) {
        dispatch({
          type: GET_PRODUCT_DETAILS,
          payload: result
        });
      } else {
        toast.error("Registration failed: " + message);
      }
    } catch (error) {
      if (error.response) {
        const { data: { message } } = error.response;
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
};


export const newProducts = ()=>{
  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}/admin/product/best-product`,{
        headers:{
          'Content-Type':'application/json'
        }
      })
      if(response.status ===200){
        console.log(response)
        const {data:{message,statusCode,result}}=response;
        dispatch({
          type:BEST_PRODUCTS,
          payload:result
        })
      }else{
        const err = response.data.message;
        throw Error(err)
      }
    } catch (error) {
      console.log(error)
    }
  }
}