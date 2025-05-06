import { FaTruckLoading } from "react-icons/fa";
import { BEST_PRODUCTS } from "../action/actionType";
import { act } from "react";

const initialState = {
    products:{
 
    },
    loading:true,
    error:null
}

const newProductsReducer = (state=initialState,action) =>{
    switch (action.type){
        case BEST_PRODUCTS:{
            return {...state,products:action.payload}
        }
        default: 
        return state
    }
}

export default newProductsReducer