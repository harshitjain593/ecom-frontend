import { VERIFY_MOBILE_REGISTER, VERIFY_EMAIL_REGISTER } from "../action/actionType"


const intialState = {
    error:null,
    data:{},
    loading:false
}

const registerReducer = (state=intialState,action) => {
    switch(action.type) {
        case VERIFY_MOBILE_REGISTER:{
            return {...state,data:action.payload}
        }
        case VERIFY_EMAIL_REGISTER:{
            return {...state,data:action.payload}
        }
        default:
        return state
    }

}

export default registerReducer