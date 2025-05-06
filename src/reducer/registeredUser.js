import { REGISTER_FAILED, REGISTER_SUCCESS } from "../action/actionType"


const initialState= {
    loading:true,
    error:null,
    data:{

    }
}

const registeredUser = (state=initialState,action)=>{
    switch(action.type) {
        case REGISTER_SUCCESS:{
            return{...state,loading:false,data:action.payload}
        }
        case REGISTER_FAILED:{
            return{...state,loading:false,error:action.payload}
        }
        default:
            return state
    }
}

export default registeredUser