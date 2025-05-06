// import axios from "axios";
// import { API_URL } from "../service/api";
// import { ADD_COMPARE_PRODUCTS } from "./actionType";

// // Async action creator using redux-thunk
// const addCompareProducts = async(productIds) => {
  
//     try {
//       const response = await axios.post(`${API_URL}/admin/product/product-comparison`, {productIds});
      
//       if (response.status === 200) {
//         const { data: { message, result } } = response;
        
//         // Dispatch the action with the result
//         return  result;
        
//         console.log(message, result);  // You can handle or log the message as needed
//       } else {
//         const err = response.message;
//         throw new Error(err);
//       }
//     } catch (error) {
//       console.log(error, 'Error from add products to compare');
//       // Optionally, dispatch an error action here
//       // dispatch({ type: 'ADD_COMPARE_PRODUCTS_ERROR', error: error.message });
//     }
//   };


// export default addCompareProducts;
