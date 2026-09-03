import { API_URL } from "../service/api";
import { toast } from "react-toastify";
import { FILTER_PRODUCTS } from "./actionType";

export const filterProducts = (base = {}) => {
    return async dispatch => {
        // API defaults to page=1, limit=10 — always send explicit pagination.
        const query = {
            page: 1,
            limit: 12,
            ...base,
        };
        console.log('base ', query);
        const endpoint = Object.entries(query)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    value = value.join(',');
                }
                const endcode = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                return decodeURIComponent(endcode);
            })
            .join('&');
        try {
            const response = await fetch(`${API_URL}/mobileApi/product/filter-product?${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
