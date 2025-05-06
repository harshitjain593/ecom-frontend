import axios from "axios";
import { API_URL } from "../service/api";
import { ADD_TO_SUMMARY, CART_TO_SUMMARY, GET_ORDER_SUMMARY, REMOVE_FROM_SUMMARY, UPDATE_SUMMARY_QUANTITY } from "./actionType";
import { toast } from "react-toastify";
import { type } from "@testing-library/user-event/dist/type";


export  const addSingleToOrderSummary = (productId,quantity,colorID=null) => {
    console.log(colorID ,'buynow')
    return async dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            console.log('please log in')
            return
        }
        
        try {
                    const reqBody = {quantity:quantity,...(colorID&&{colorOptionId:colorID})}
                    const response = await fetch(`${API_URL}/mobileApi/summary/order-summary/${productId}`,{
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(reqBody)
                    })
                      
                    if(response.status ===200){
                        const data = await response.json()
                        const { message } = data.data;             
                        dispatch({
                            type:ADD_TO_SUMMARY,
                        })
                        toast.success('added single product to order summary')
                    } else {
                        console.error(response.statusText)
                    }
        } catch (error) {
            toast.error(error)
        }


    }
}



export const getOrderSummary = () => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            console.error('please login')
            return
        }
        try {
            const response = await axios.get(`${API_URL}/mobileApi/summary/order-summary`,{
                headers:{
                    'Authorization' : `Bearer ${token}`,
                    "Content-Type" : 'application/json'
                }
             })
             if(response.status = 200){
                const { result , message} = response.data;
                dispatch({
                    type:GET_ORDER_SUMMARY,
                    payload:result
             })
             console.log(result)
            } else {
                console.log('something wrong in getsummary')
            }
    }catch(error){
        console.error(error)
    }
    }
}


export const updateOrderSummary = (productId,colorId,quantity) => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            console.error('please login');
            return
        }
        try {
            const reqBody = { quantity:quantity,colorOptionId:colorId}
            const response = await fetch(`${API_URL}/mobileApi/summary/order-summary/${productId}`,{
                method:'PUT',
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(reqBody)
            })
            console.log(response,'ressppppp update')

            if(response.status === 200){
                const data = response.json();
                const {result, message} = data.data;
                dispatch({
                    type:UPDATE_SUMMARY_QUANTITY,
                    payload:{
                        id:productId,
                        quantity:quantity
                    }
                })
                console.log(result,'summary udpate')
            } else {
                throw Error ( response)
            }
        } catch (error) {
            toast.error(error)
        }
    }
}

export const CartToOrderSummary = () => {
 return async dispatch => {
     try {
        const token = localStorage.getItem('token');
        if(!token){
            console.log('please login')
            return
        }
        const response = await fetch(`${API_URL}/mobileApi/summary/add-to-order-summary`,{
            method:'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if(response.status === 200){
            const data = await response.json();
            const {message, result} = data;
            dispatch({type:CART_TO_SUMMARY,
                payload:result
            })
        } else {
            throw Error(response)
        }
    } catch (error) {
        toast.error(error);
        console.error(error)
        
    }
 }
}

export const removeFromOrderSummary = (productId,colorId) => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            console.log('please log in')
            return
        }
        try {
            const response = await fetch(`${API_URL}/mobileApi/summary/remove-summary-product/${productId}/${colorId}`,{
                method:`PUT`,
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            })

            if(response.status === 200){
                const datas = await response.json();
                const {data:{result,message}={}} = datas;
                dispatch({type:REMOVE_FROM_SUMMARY,
                    payload:{
                        id:productId
                    }
                })
                console.log(datas)
            }else{
              const errors = response.json()
              throw Error(errors)
            }
            
        } catch (error) {
            toast.error(error)
            console.error(error)
            
        }
    }
}