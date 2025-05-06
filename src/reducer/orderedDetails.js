import { CREATE_ORDER } from "../action/actionType"

const intialState = {
    error:null,
    loading:true,
    data:{}
}

const orderDetailsReducer = (state=intialState, action) => {
    switch (action.type) {
        case CREATE_ORDER : {
            return {
                ...state,
                data:action.payload,
                loading:false
            }

        }
        default :{
            return state
        }
    }
}

export default orderDetailsReducer;