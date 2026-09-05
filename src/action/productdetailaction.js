import { API_URL } from '../service/api';
import axios from 'axios';
import {
  BEST_PRODUCTS,
  GET_PRODUCT_DETAILS,
} from './actionType';
import { toast } from 'react-toastify';
import { getCart, removeFromCart } from './getCartAction';
import { getWishlist } from './wishListAciton';
import { findCartItem } from '../utils/cartUtils';

export const addWishList = (productId) => {
  return async (dispatch, getState) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const existing = getState()?.WishlistData?.data?.products ?? [];
      if (existing.some((product) => product._id === productId)) {
        return { success: true, alreadyExists: true };
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
        const { statusCode } = data;

        if (statusCode === 200) {
          return dispatch(getWishlist());
        }
      } else {
        const errorData = await response.json();
        console.log('data', errorData);
      }

      return { success: false };
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return { success: false };
    }
  };
};


export const updateCart = ({ productId, colorId = null, quantity }) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }
      const requestBody = {
        productId,
        quantity,
        ...(colorId ? { colorOptionId: colorId } : { colorOptionId: null }),
      };
      const response = await fetch(
        `${API_URL}/mobileApi/cart/update-cart/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { message, statusCode } = data;

        if (statusCode === 200) {
          await dispatch(getCart());
          return { success: true };
        }
        toast.error('Failed to update cart: ' + message);
        return { success: false };
      }

      const errorData = await response.json();
      toast.error(errorData.message || 'An unexpected error occurred');
      return { success: false };
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error('An unexpected error occurred');
      return { success: false };
    }
  };
};

/**
 * Set absolute quantity for a product in cart.
 * Clears duplicate lines for the same product/color first, then adds the desired qty.
 */
export const setCartQuantity = ({ productId, colorId = null, quantity }) => {
  return async (dispatch, getState) => {
    const qty = Number(quantity) || 0;

    let guard = 0;
    while (guard++ < 15) {
      const items = getState()?.CartData?.data?.cartItems ?? [];
      if (!findCartItem(items, productId, colorId)) break;
      await dispatch(removeFromCart({ productId, colorId }));
    }

    if (qty <= 0) {
      return { success: true };
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };

      const requestBody = {
        productId,
        quantity: qty,
        ...(colorId && { colorOptionId: colorId }),
      };
      const response = await fetch(
        `${API_URL}/mobileApi/cart/add-to-cart/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.statusCode === 200) {
          await dispatch(getCart());
          return { success: true };
        }
        toast.error(data.message || 'Failed to update cart');
        return { success: false };
      }

      const errorData = await response.json();
      toast.error(errorData.message || 'Failed to update cart');
      return { success: false };
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
      return { success: false };
    }
  };
};

/** Add to cart, or bump quantity if the product is already in the cart. */
export const addtoCart = (productId, colorId = null, quantity = 1) => {
  return async (dispatch, getState) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const cartItems = getState()?.CartData?.data?.cartItems ?? [];
      const existing = findCartItem(cartItems, productId, colorId);
      if (existing) {
        const nextQty =
          (Number(existing.quantity) || 0) + (Number(quantity) || 1);
        return dispatch(
          updateCart({ productId, colorId, quantity: nextQty })
        );
      }

      const requestBody = {
        productId,
        quantity,
        ...(colorId && { colorOptionId: colorId }),
      };
      const response = await fetch(
        `${API_URL}/mobileApi/cart/add-to-cart/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { message, statusCode } = data;

        if (statusCode === 200) {
          await dispatch(getCart());
          return { success: true };
        }
        toast.error('Failed to add to Cart: ' + message);
        return { success: false };
      }

      const errorData = await response.json();
      toast.error(errorData.message || 'An unexpected error occurred');
      return { success: false };
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error('An unexpected error occurred');
      return { success: false };
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