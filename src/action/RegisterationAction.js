
import { API_URL } from "../service/api"
import { VERIFY_EMAIL_REGISTER, VERIFY_MOBILE_REGISTER } from "./actionType";


export const registerVerifyEmail = (form) => {
    return async dispatch => {
        try {
            const response = await fetch(`${API_URL}/mobileApi/register`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(form)
            })
         
            if(response.status===200){
                const data = await response.json();
                const {result} = data;
                dispatch({
                    type:VERIFY_EMAIL_REGISTER,
                    payload:result
                })

            }
                } catch (error) {
                    console.log(error)
            
        }

    }
}

// Keep the old mobile verification for COD and other mobile-based features
export const registerVerifyMobile = (form) => {
    return async dispatch => {
        try {
            const response = await fetch(`${API_URL}/mobileApi/verify-mobile`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(form)
            })
         
            if(response.status===200){
                const data = await response.json();
                const {result} = data;
                dispatch({
                    type:VERIFY_MOBILE_REGISTER,
                    payload:result
                })

            }
                } catch (error) {
                    console.log(error)
            
        }

    }
}

export const registerVerifyOtp = async(form) => {
    
        try {
            const response = await fetch(`${API_URL}/mobileApi/complete-registration`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(form)
            })
            if(response.status===200){
                const data = await response.json();
                return {
                    status:true,
                    message:data.message,
                    result: data.result
                }
            }else{
                const err = await response.json()
                return {
                    status:false,
                    message:err.message
                }
                
            }
        } catch (error) {
            console.log(error)
            return {
                status:false,
                message:"Network error occurred"
            }
        }
    }
    
