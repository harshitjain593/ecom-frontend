import { ADD_NEW_ADDRESS, DELETE_ADDRESS, GET_PROFILE, UPDATE_ADDRESS } from "../action/actionType";


const intialState = {
    user:null,
    loading:true,
    error:null
}

const getUserReducer = (state = intialState,action) => {
    switch (action.type) {
        case GET_PROFILE:
            return {...state , user:action.payload ,loading:false}
        case ADD_NEW_ADDRESS:
            return{
                ...state,
                user:action.payload,
                loading:false
            }
        case DELETE_ADDRESS:
            return{
                ...state,
                user:action.payload,
                loading:false
            }
        case UPDATE_ADDRESS:
            return{
                ...state,
                user:action.payload,
                loading:false
            }
            default:
                return state
}
}

export default getUserReducer;