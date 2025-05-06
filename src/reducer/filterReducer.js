import { FILTER_PRODUCTS } from "../action/actionType";

const initialState = {
    loading:true,
    products: [],
    error: null,

}

const filterReducer = (state=initialState,action)=>{
    switch(action.type){
        case FILTER_PRODUCTS:
           return {
            ...state,
            products:action.payload,
            loading:false,
            }
            default:
                return state;

    }
}

export default filterReducer;