import { FETCH_PRODUCT_SUCCESS } from '../action/actionType';

const initialState = {
  BsDatabaseDash: [],
  loading: false,
  error: null
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: ''
      };
    default:
      return state;
  }
};

export default productReducer;
