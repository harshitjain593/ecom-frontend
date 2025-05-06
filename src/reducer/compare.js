import { ADD_COMPARE_PRODUCTS, CLEAR_ERROR, REMOVE_COMPARE_PRODUCTS } from "../action/actionType"

const initialState = {
    data: {
        products: JSON.parse(localStorage.getItem('compare')) || [],
    },
    loading: true,
    error: null,
};

const compareReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_COMPARE_PRODUCTS: {
            if(state.data.products.length >=3){
                alert('You can compare maximum 3 products')
                return state
            }
            if(state.data.products.length>0 && state.data.products.some(item=>item.category !== action.payload.category)){
                alert('You can compare only products from the same category')
                return state
            }
            const duplicate = state.data.products.some(item => item._id === action.payload._id);
            if (duplicate) {
                console.log('Product already exists in compare');
                return state;
            }
            
            const updatedProducts = [...state.data.products, action.payload];
            localStorage.setItem('compare', JSON.stringify(updatedProducts));
            
            return {
                ...state,
                loading: false,
                data: {
                    ...state.data,
                    products: updatedProducts,
                },
            };
        }

        case REMOVE_COMPARE_PRODUCTS: {
            const updatedProducts = state.data.products.filter(item => item._id !== action.payload._id);
            localStorage.setItem('compare', JSON.stringify(updatedProducts));
            
            return {
                ...state,
                data: {
                    ...state.data,
                    products: updatedProducts,
                },
                loading: false,
            };
        }

        default:
            return state;
    }
}

export default compareReducer;
