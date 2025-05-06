import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../service/api";
import { GET_WISHLIST, MOVE_TO_CART, REMOVE_FROM_WISHLIST } from "./actionType";

export const moveToCart = async (productId) => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // toast.error('please login');
                return;
            }

            const response = await fetch(`${API_URL}/mobileApi/wishlist/move-product-to-cart/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                    }
            })
    
            if (response.status === 200) {
                const data = await response.json();
                const { statusCode, message, result } = data;
                console.log(data, 'product found in check wishlist');
                if (statusCode === 200) {
                    dispatch({
                        type: MOVE_TO_CART,
                        payload: productId
                    })
                    // toast.success(message + 'successfully move to cart');
                    
                } else {
                   
                }
            } else {
                const errorData = await response.data;
                throw new Error(errorData.message || 'error in check wishlist request');
            }
        } catch (error) {
            
            console.log(error);
        }
    }
    
}


export const removeFromWishlist = (productId)=>{
    return async dispatch =>{
        try {
            const token = localStorage.getItem('token');
            console.log(token , 'this from remove wihslist')
            if (!token) {
                // toast.error('please login');
                return;
            }
            const response = await fetch(`${API_URL}/mobileApi/wishlist/remove-from-wishlist/${productId}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
    
            if (response.status === 200) {
                const data = await response.json();
                const { statusCode, message, result } =  data;
                console.log(data, 'product not removed from wishlist error');
                if (statusCode === 200) {
                    dispatch({
                        type: REMOVE_FROM_WISHLIST,
                        payload:productId
                    })
                    // toast.success('product removed from wishlist')
                    
                } else {
                    
                }
            } else {
                const errorData = await response.data;
                throw new Error(errorData.message || 'error in remove from wishlist request');
            }
        } catch (error) {
           
            console.log(error);
        }
    }
}



export const getWishlist = () => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token');
          
            if (!token) {
                // toast.error('please login');
                return;
                }
                const response = await axios.get(`${API_URL}/mobileApi/wishlist/wishlist`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                        }   
                    });
                       
                        if (response.status === 200) {
                            const {statusCode , message , result} = response.data;
                           
                            if (statusCode === 200) {
                                dispatch({type: GET_WISHLIST, payload: result});
                                // toast.success(message);
                                } else {
                                    
                                    }   
                                    } else {
                                        throw Error(response)
            
                                    }
                                } catch (error) {
                                
                                    console.log(error,'from getwhishlist');
                                    
        }   
    }
}   