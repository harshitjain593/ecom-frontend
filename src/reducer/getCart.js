import { GET_CART, ADD_TO_CART, DELETE_FROM_CART, UPDATE_CART } from "../action/actionType";

const initialState = {
  loading: false,
  data: {
    cartItems: [  ],
    totalQuantity: 0, 
  },
  error: ''
};

const getCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false
      };
    case ADD_TO_CART:
      return {
        ...state,
        data: {
          ...state.data,
          totalQuantity: state.data.totalQuantity + action.payload.quantity, 
        error: ''
      }
    }
    case UPDATE_CART :
      // console.log(action.payload,'update cart')
      // const updatedProducts = state.data?.cartItems.map(product => {
      //    if(action.payload.colorId && product.product.colorOptionId === action.payload.colorId){
      //       return {
      //         ...product,
      //         product:{quantity:action.payload}
      //       }
      //    }
      //   // else if (product.product.id === action.payload.productId) {
      //   //   return {
      //   //     ...product,
      //   //     product:{quantity:action.payload}
      //   //   };
      //   // }
      //   return product;
      // });
      // let previousQuantity;
      // if(action.payload.colorId){
      //    previousQuantity = state.data.cartItems.find(product => product.product.colorOptionId === action.payload.colorId)?.product.quantity || 0;
      // }
      // else{

      //   previousQuantity = state.data.cartItems.find(product => product.product.id === action.payload.productId)?.product.quantity || 0;
      // }

      // const quantityDifference = action.payload.result.quantity - previousQuantity;
      return {
        ...state,
        data: {
          ...action.payload.result.cart
        },
        error: ''
      };
  case DELETE_FROM_CART: 
       let updateCartItem;
       if(action.payload.colorId){
           updateCartItem = state.data?.cartItems.map(item => item.product.colorOptionId === action.payload.colorId)
       }
  return {
    ...state,
     data: {
      ...state.data, 
      cartItems: updateCartItem,
      totalQuantity: state.data.totalQuantity - action.payload.quantity,
      error: ''
      }
  }
    default:
      return state;
  }
};

export default getCartReducer;
