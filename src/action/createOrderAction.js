import { toast } from "react-toastify";
import { API_URL } from "../service/api";
import { CREATE_ORDER } from "./actionType";


export const createOrder = (products)=>{
    return async dispatch => {
        console.log(products, 'cheking the params for the createorder');
        
        const token = localStorage.getItem('token');
        try {
            const reqbody = {...products}
            const response = await fetch(`${API_URL}/mobileApi/order/create-order`,{
                method:'POST',
                headers:{
                    ...(token&&{'Authorization' : `Bearer ${token}`}),
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(reqbody)
                
            })
            console.log('create order api called', response);
            
            if(response.status === 200){
                const datas= await response.json();
                console.log(datas,"dataaaaaaaaaaaaaaaaas")
                const {result,statusCode,message } = datas;
                dispatch({
                    type:CREATE_ORDER,
                    payload:result
                })
            } else {
                console.log(`create order failed`)
                const err = response.json()
                throw Error(err)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error)
            
        }
    }
}