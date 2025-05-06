import { GET_TRACKING_DATA } from "../action/actionType";

const initailState = {
    shipmentData:[],
    error:null,
    loading:true

}

const trackingReducer = (state=initailState,action) => {
    switch(action.type){
        case GET_TRACKING_DATA:{
            return{...state, loading:false,shipmentData:[...action.payload]}
        }
        default : {
            return state
        }
    }
}


export default trackingReducer;
