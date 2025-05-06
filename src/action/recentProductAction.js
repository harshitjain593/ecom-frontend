import { toast } from "react-toastify"
import { API_URL } from "../service/api"
import {  GET_RECENT_PRODUCT } from "./actionType"
import axios from "axios"



export const addRecentProduct = (productId) => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token')
        if(!token) {
            // toast.error('please login')
            return
        }
        const response = await fetch(`${API_URL}/mobileApi/product/add-recently-view-product/${productId}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            const datas = await response.json();
            const {data, message , statusCode} = datas
          if (statusCode === 200) {
            // toast.success(message);
            dispatch({ type: GET_RECENT_PRODUCT, payload: data });
            } else {
                throw Error('went wrong in add to recent items')
                }
                } 
        } catch (error) {
            console.log(error)
            
        }

        }
    }

    
    export const getRecentProducts = () => {
        return async dispatch => {
            try {
                const token = localStorage.getItem('token');
                if(!token) {
                    // toast.error('please login');
                    return ;
                }
                const response = await axios.get(`${API_URL}mobileApi/product/recently-view-product`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                }});
                if (response.ok) {
                    const {statusCode ,message, result} = response;
                    console.log(result)
                    if(statusCode === 200) {
                        dispatch({ 
                            type: GET_RECENT_PRODUCT,
                             payload: result});
                        // toast.success('recent products received');
                    }
                }else{
                    throw Error ( response)
                }
                
            } catch (error) {
                console.log(error.message)
                
            }

        }
    }