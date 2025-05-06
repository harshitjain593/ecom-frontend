import { ADD_TO_SUMMARY, GET_ORDER_SUMMARY, REMOVE_FROM_SUMMARY, UPDATE_SUMMARY_QUANTITY } from "../action/actionType";


const intialState = {
    data: {},
    error:null,
    loading:true,
}

const orderSummaryReducer = (state=intialState,action) => {
    switch(action.type){
        case GET_ORDER_SUMMARY: {
            console.debug(action.payload)
            return {
                ...state,
                data:action.payload,
                loading:false
            }
        }
        case UPDATE_SUMMARY_QUANTITY:{

          const updatedOrderItems =  state.data.orderItems.map(item=>{
              if( item.product._id === action.payload.id){
                  return {
                    ...item,
                    quantity:action.payload.quantity,
                  }}
              return item
            })
            return {
                ...state,
                data:{
                    ...state.data,
                    orderItems:updatedOrderItems
                }
            }
        
        }
        case REMOVE_FROM_SUMMARY : {
        const updatedOrderItems = state.data.orderItems.map(item => item.product._id !== action.payload.id)
        return {
            ...state,
            data:{
                ...state.data,
                orderItems:updatedOrderItems
            }
        }
    };
        default: return state;
    }
}

export default orderSummaryReducer;