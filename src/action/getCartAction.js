
import { API_URL } from "../service/api";
import { DELETE_FROM_CART, GET_CART } from "./actionType";
import { toast } from "react-toastify";

export const getCart = () => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // toast.error('User is not authorised');
                return;
            }
            fetch(`${API_URL}/mobileApi/cart/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return response.json(); // Parse response as JSON
            }).then((data) => {
                const { message, statusCode } = data;
                if (statusCode === 200) {
                    dispatch({
                        type: GET_CART,
                        payload: data.result,
                    });
                    // toast.success(message);
                } else {
                    // toast.error( 'Failed to get cart data');
                }
            }).catch(error => {
                throw error;
            });
        } catch (error) {
            if (error.response) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                 
                } else {
                    
                }
            }
        }
    }
}


export const removeFromCart = (props)=>{
     const{ productId,colorId=null ,quantity} = props
     console.log(colorId,'remove cart')
    return async dispatch => {
        try {
                const token = localStorage.getItem("token");
                if (!token) {
                  // toast.error("User is not authenticated");
                  return;
                }
                const response = await fetch(
                  `${API_URL}/mobileApi/cart/remove-cart-product/${productId}/${colorId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
          
                if (response.ok) {
                  const data = await response.json();
                  const { statusCode, message, result } = data;
                  if (statusCode === 200) {
                    dispatch({
                        type: DELETE_FROM_CART,
                        payload:{
                            quantity,
                            productId,
                            ...(colorId&&{colorId}
 )                       }
                        });
                  
                    // toast.success(message);
                  } else {
                    toast.error(message || "Failed to remove product from cart");
                  }
                } else {
                  const errorData = await response.json();
                  
                }
              } catch (error) {
                console.error("An unexpected error occurred:", error);
                
              
            
    }

    }
}