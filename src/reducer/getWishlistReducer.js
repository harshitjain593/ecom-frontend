import { GET_WISHLIST, MOVE_TO_CART, REMOVE_FROM_WISHLIST, ADD_TO_WISHLIST } from "../action/actionType";
import { normalizeWishlistProducts } from "../utils/cartUtils";

const initialState = {
  loading: true,
  error: null,
  data: {
    products: [],
    totalItem: 0,
  },
};

const getWhishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WISHLIST: {
      const products = normalizeWishlistProducts(action.payload);
      return {
        ...state,
        data: {
          products,
          totalItem: action.payload?.totalItem ?? products.length,
        },
        loading: false,
      };
    }

    case ADD_TO_WISHLIST:
      return {
        ...state,
        data: {
          ...state.data,
          products: [...state.data.products, action.payload],
          totalItem: state.data.totalItem + 1,
        },
      };

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        data: {
          ...state.data,
          products: state.data.products.filter(
            (product) => product._id !== action.payload
          ),
          totalItem: Math.max(0, state.data.totalItem - 1),
        },
      };

    case MOVE_TO_CART:
      return {
        ...state,
        data: {
          ...state.data,
          products: state.data.products.filter(
            (product) => product._id !== action.payload
          ),
          totalItem: Math.max(0, state.data.totalItem - 1),
        },
      };

    default:
      return state;
  }
};

export default getWhishlistReducer;
