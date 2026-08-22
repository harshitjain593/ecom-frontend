import { API_URL } from "../service/api";
import { DELETE_FROM_CART, GET_CART } from "./actionType";
import { toast } from "react-toastify";
import { normalizeCartPayload } from "../utils/cartUtils";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getCart = () => {
  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) {
      return { success: false };
    }

    try {
      const response = await fetch(`${API_URL}/mobileApi/cart/cart`, {
        method: "GET",
        headers,
      });

      const data = await response.json();
      const { statusCode, message, result } = data;

      if (statusCode === 200) {
        const cart = normalizeCartPayload(result);
        dispatch({
          type: GET_CART,
          payload: cart,
        });
        return { success: true, data: cart };
      }

      console.error("getCart failed:", message);
      return { success: false };
    } catch (error) {
      console.error("getCart error:", error);
      return { success: false };
    }
  };
};

export const removeFromCart = (props) => {
  const { productId, colorId = null, quantity } = props;

  return async (dispatch) => {
    const headers = authHeaders();
    if (!headers) {
      toast.error("Please log in to manage your cart");
      return { success: false };
    }

    try {
      const response = await fetch(
        `${API_URL}/mobileApi/cart/remove-cart-product/${productId}/${colorId}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { statusCode, message } = data;

        if (statusCode === 200) {
          return dispatch(getCart());
        }

        toast.error(message || "Failed to remove product from cart");
        return { success: false };
      }

      const errorData = await response.json();
      toast.error(errorData?.message || "Failed to remove product from cart");
      return { success: false };
    } catch (error) {
      console.error("removeFromCart error:", error);
      toast.error("Failed to remove product from cart");
      return { success: false };
    }
  };
};
