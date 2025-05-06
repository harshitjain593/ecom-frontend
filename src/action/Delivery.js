import axios from "axios";
import { API_URL } from "../service/api";
import { type } from "@testing-library/user-event/dist/type";
import { CHECK_DELIVERY } from "./actionType";


export const checkDelivery = (pincode) => {
    return async dispatch => {

        try {
            const response = await axios.get(`${API_URL}/mobileApi/zip?pinCode=${pincode}`, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });
           
            if(response.status=== 200){
                dispatch({
                    type:CHECK_DELIVERY,
                    payload: response.data.result
                })
              
            }else{
                throw Error(response)
            }
    
            
        } catch (error) {
            console.error(error);
            
        }
    }
}