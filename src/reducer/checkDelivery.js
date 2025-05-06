import { CHECK_DELIVERY } from "../action/actionType"

const intialState = {
    data:[],
    error:null,

}

export const CheckDeliveryReducer = (state=intialState,action)=>{
    switch(action.type){
        case CHECK_DELIVERY:
            return{
                ...state,
                data:action.payload,
                error:null
            }
            default:
                return state
    }
}