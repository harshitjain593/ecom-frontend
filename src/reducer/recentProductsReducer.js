
import { GET_RECENT_PRODUCT } from "../action/actionType"


const initialState = {
    data:{},
    loading : true,
    error:null
}


const recentProuductsReducer = (state = initialState, action) =>{
    switch (action.type) {
        case GET_RECENT_PRODUCT: 
        console.log('runnnig recent products ')
        return {
            ...state, 
            loading:false,
            data: action.payload
        }
        default :
        return state
    }
}

export default recentProuductsReducer;