import { GET_WISHLIST, MOVE_TO_CART, REMOVE_FROM_WISHLIST, ADD_TO_WISHLIST } from "../action/actionType";

const initialState = {
  loading: true,
  error: null,
  data: {
    products: [],
    totalItem: 0, // or whatever key you are using to keep track of the total item count
  },
};

const getWhishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WISHLIST:
      return { 
        ...state, 
        data: {
          products: action.payload.products,
          totalItem: action.payload.totalItem
        }, 
        loading: false 
      };

    case ADD_TO_WISHLIST:
      return {
        ...state,
        data: {
          ...state.data,
          products: [...state.data.products, action.payload],
          totalItem: state.data.totalItem + 1, // Update total count
        },
      };

    case REMOVE_FROM_WISHLIST:
      console.log('Product removed', action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          products: state.data.products.filter(product => product._id !== action.payload),
          totalItem: state.data.totalItem - 1, // Update total count
        },
      };

    case MOVE_TO_CART:
      return {
        ...state,
        data: {
          ...state.data,
          products: state.data.products.filter(product => product._id !== action.payload),
          totalItem: state.data.totalItem - 1, // Update total count
        },
      };

    default:
      return state;
  }
};

export default getWhishlistReducer;
