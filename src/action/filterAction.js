import { API_URL } from "../service/api";
import { toast } from "react-toastify";
import { FILTER_PRODUCTS } from "./actionType";

export const filterProducts = (base) => {
    return async dispatch => {
        let endpoint  ;
        console.log('base ',base)
        if (base) {
            // Convert the base object to a query string
            endpoint = Object.entries(base)
                .map(([key, value]) => {
                    // Check if the value is an array
                    if (Array.isArray(value)) {
                        // Join the array into a comma-separated string
                        value = value.join(',');
                    }
                    // Properly encode key and value
                   const endcode =`${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                   return decodeURIComponent(endcode)
                }).join('&');
        }
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/mobileApi/product/filter-product?${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }) // Add token header if available
                }
            });
           

            if (!response.ok) {
                throw new Error('Failed to fetch filtered products');
            }

            const data = await response.json();
             const {statusCode , result,message} = data;
              if(statusCode ===200){
            dispatch({
                type: FILTER_PRODUCTS,
                payload: result
            });
            
            
        }

        } catch (error) {
            console.error('Error fetching filtered products:', error);
           toast.error(error)
        }
    };
};
