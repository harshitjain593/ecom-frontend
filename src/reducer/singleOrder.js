import { GET_MY_ORDER_SINGLE_DETAIL } from "../action/actionType";


const intialState = {
    data:{},
    loading: true,
    error:null
}

const singleOrder = (state=intialState,action)=>{
    switch(action.type){
        case GET_MY_ORDER_SINGLE_DETAIL:
            return{...state, data:action.payload,loading:false}
        default: return state
    }
}

export default singleOrder;