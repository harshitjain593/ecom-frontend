import { GET_CART } from "../action/actionType";
import { normalizeCartPayload } from "../utils/cartUtils";

const initialState = {
  loading: false,
  data: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    totalPayablePrice: 0,
    totalDiscountedPrice: 0,
  },
  error: "",
};

const getCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        data: normalizeCartPayload(action.payload),
        error: "",
        loading: false,
      };
    default:
      return state;
  }
};

export default getCartReducer;
