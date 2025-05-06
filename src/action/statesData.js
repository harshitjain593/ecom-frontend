import axios from "axios"
import { API_URL } from "../service/api"
import { ADD_STATES_DATA } from "./actionType"

export const statesData = ()=>{
    return async dispatch=> {
        try {
            const response = await axios.get(`${API_URL}/admin/state/states`)

            if(response.status===200){
                console.log(response,'states data')
                const {data:{result} } = response;
                dispatch({
                    type:ADD_STATES_DATA
                    , payload: result
                })

            }else{
                throw Error(response)
            }
            
        } catch (error) {
            console.log(error.message)
            
        }
    }
}