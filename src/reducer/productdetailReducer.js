import { GET_PRODUCT_DETAILS } from '../action/actionType'; // Ensure this is the correct path

const initialState = {
  product: null,
  loading: true
};

const productdetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default productdetailReducer;
