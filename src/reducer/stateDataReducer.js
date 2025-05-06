import { retry } from "@reduxjs/toolkit/query"
import { ADD_STATES_DATA, GET_DISTRICTS} from "../action/actionType"

const intialState = {
    error:null,
    loading:false,
    data:[],
    state:[],
    districts:[]
}

const statesData = (state=intialState,action) => {
    switch (action.type) {
        case ADD_STATES_DATA:{
            const states = action.payload.map(item=> item.state)
            return {...state,loading:false,error:null,data:action.payload,state:states}
        }
        case GET_DISTRICTS: {
            const stateData = state.data.find(item => item.state === action.payload.state);
            return {
                ...state,
                districts: stateData ? stateData.districts : []
            };
        }
        
        default :
        return state;
    }
}

export default statesData