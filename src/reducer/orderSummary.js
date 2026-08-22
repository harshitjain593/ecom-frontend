import {
  CART_TO_SUMMARY,
  GET_ORDER_SUMMARY,
  REMOVE_FROM_SUMMARY,
} from "../action/actionType";

const intialState = {
  data: {},
  error: null,
  loading: true,
};

const orderSummaryReducer = (state = intialState, action) => {
  switch (action.type) {
    case GET_ORDER_SUMMARY:
    case CART_TO_SUMMARY:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case REMOVE_FROM_SUMMARY: {
      const orderItems = state.data?.orderItems?.filter(
        (item) => item.product?._id !== action.payload.id
      );
      return {
        ...state,
        data: {
          ...state.data,
          orderItems,
        },
      };
    }
    default:
      return state;
  }
};

export default orderSummaryReducer;
