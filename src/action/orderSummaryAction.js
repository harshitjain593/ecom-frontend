import axios from "axios";
import { API_URL } from "../service/api";
import {
  CART_TO_SUMMARY,
  GET_ORDER_SUMMARY,
  REMOVE_FROM_SUMMARY,
} from "./actionType";
import { toast } from "react-toastify";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const addSingleToOrderSummary = (
  productId,
  quantity,
  colorID = null,
  size = null
) => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) {
      toast.error("Please log in to continue");
      return { success: false };
    }

    try {
      const reqBody = {
        quantity,
        ...(colorID && { colorOptionId: colorID }),
        ...(size && { size }),
      };
      const response = await fetch(
        `${API_URL}/mobileApi/summary/order-summary/${productId}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(reqBody),
        }
      );

      if (response.status === 200) {
        await dispatch(getOrderSummary());
        toast.success("Product added to order summary");
        return { success: true };
      }

      toast.error("Could not add product to order summary");
      return { success: false };
    } catch (error) {
      toast.error("Could not add product to order summary");
      return { success: false };
    }
  };
};

export const getOrderSummary = () => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) return { success: false };

    try {
      const response = await axios.get(
        `${API_URL}/mobileApi/summary/order-summary`,
        { headers }
      );

      if (response.status === 200) {
        const { result } = response.data;
        dispatch({
          type: GET_ORDER_SUMMARY,
          payload: result,
        });
        return { success: true, data: result };
      }
      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };
};

export const updateOrderSummary = (productId, colorId, quantity) => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) return { success: false };

    try {
      const response = await fetch(
        `${API_URL}/mobileApi/summary/order-summary/${productId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ quantity, colorOptionId: colorId }),
        }
      );

      if (response.status === 200) {
        return dispatch(getOrderSummary());
      }

      toast.error("Could not update quantity");
      return { success: false };
    } catch (error) {
      toast.error("Could not update quantity");
      return { success: false };
    }
  };
};

export const CartToOrderSummary = () => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) {
      toast.error("Please log in to continue");
      return { success: false };
    }

    try {
      const response = await fetch(
        `${API_URL}/mobileApi/summary/add-to-order-summary`,
        {
          method: "POST",
          headers,
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        const result = data?.result ?? data?.data?.result;
        if (result) {
          dispatch({ type: CART_TO_SUMMARY, payload: result });
        }
        return dispatch(getOrderSummary());
      }

      toast.error("Could not move cart to order summary");
      return { success: false };
    } catch (error) {
      toast.error("Could not move cart to order summary");
      return { success: false };
    }
  };
};

export const removeFromOrderSummary = (productId, colorId) => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) return { success: false };

    try {
      const response = await fetch(
        `${API_URL}/mobileApi/summary/remove-summary-product/${productId}/${colorId}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (response.status === 200) {
        return dispatch(getOrderSummary());
      }

      toast.error("Could not remove product");
      return { success: false };
    } catch (error) {
      toast.error("Could not remove product");
      return { success: false };
    }
  };
};
