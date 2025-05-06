import { API_URL } from "../service/api";
import { VERIFY_PAYMENT } from "./actionType";

export const verifyPayment = (responses ) =>{

    return async(dispatch) => {
    try {
        const token = localStorage.getItem('token');
       
        console.log('this is response from ra' ,responses)
       
        const response =await fetch(`${API_URL}/mobileApi/order/payment-verify`,{
            method:'POST',
            headers:{
                ...(token&&{'Authorization':`Bearer ${token}`}),
                'Content-Type':'application/json'
            },
            body:JSON.stringify(responses)

        });
        console.log(response)
        if(response.status===200){
            const datas = await response.json();
            const {data:{message, result, } = {}} = datas;
            dispatch({
                type:VERIFY_PAYMENT,
                dispatch:result
            })
            console.log(result,'this is from data verify payment')


        }else{
            const err = await response.json();
            throw Error(err)
        }
    } catch (error) {
        console.log(error)
    }
}
}