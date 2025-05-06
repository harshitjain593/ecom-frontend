import axios from "axios"
import { API_URL } from "../service/api"
import { GET_TRACKING_DATA } from "./actionType"


export const trackingApi = (trackingNumber) => {
    return  async dispatch => {
        
        try {
            console.log(trackingNumber,"this is tracking number")
            const response = await fetch(`${API_URL}/admin/delivery/order-tracking`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(trackingNumber)
            })
            if(response.status ===200){
               const {result} = await response.json();
               console.log('result',result)
               dispatch({type: GET_TRACKING_DATA, payload: result.ShipmentData})


            }else{
                throw Error(response.message)
            }
        } catch (error) {
            console.log(error)
            
        }
    }

}