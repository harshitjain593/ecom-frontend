import { json } from "react-router-dom";
import {
  ADD_NEW_ADDRESS_DIRECTBUY,
  DECREASE_QUANTITY_DIRECTBUY,
  DIRECT_BUY_ADD_TO_PRODUCTS,
  GET_DIRECTBUY,
  INCREASE_QUANTITY_DIRECTBUY,
  REMOVE_QUANTITY_DIRECTBUY,
} from "../action/actionType";

const intialState = {
  data: JSON.parse(localStorage.getItem("directBuy")) || [],
  shipping_address: JSON.parse(localStorage.getItem("directAddress")) || [],
  loading: true,
  error: null,
};
const initialState = {
  data: {
    orderItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    totalPayablePrice: 0,
    totalDiscountedPrice: 0,
  },
  loading: true,
  error: null,
};

const directBuy = (state = initialState, action) => {
  switch (action.type) {
    case DIRECT_BUY_ADD_TO_PRODUCTS: {
      const newProduct = action.payload.product;
      const colorId = action.payload.colorId;
      const quantity = action.payload.quantity;
       localStorage.removeItem('directAddress')
      console.log("directbuy payload", action.payload);
      // Find the color option by matching the colorId
      const colorOption = newProduct.colorOption.find(
        (item) => item._id === colorId
      );

      if (!colorOption) {
        return {
          ...state,
          error: "Color option not found",
        };
      }

      const updatedProduct = {
        ...newProduct,
        product_name: colorOption.productName,
        productImage: colorOption.product_image,
        stock_quantity: colorOption.stock_quantity,
      };

      console.log(updatedProduct, "dby products updated check");

      const newItem = {
        product: updatedProduct,
        quantity: quantity,
        selling_price: updatedProduct.selling_price,
        mrp_price: updatedProduct.mrp_price,
        discounted_price:
          updatedProduct.mrp_price - updatedProduct.selling_price,
        colorOptionId: colorId,
      };

      // Check if the product already exists in the orderItems array
      // const existingProductIndex = state.data.orderItems.findIndex(
      //   (item) => item.colorOptionId === colorId
      // );

      let updatedOrderItems = [newItem];
      let newTotalQuantity = quantity;
      let newTotalPrice = updatedProduct.mrp_price * quantity;
      let newTotalPayablePrice = updatedProduct.selling_price * quantity;
      let newTotalDiscountedPrice = newTotalPrice - newTotalPayablePrice;

      // if (existingProductIndex > -1) {
      //   // If product exists, update its quantity and prices
      //   updatedOrderItems[existingProductIndex] = {
      //     ...updatedOrderItems[existingProductIndex],
      //     quantity: updatedOrderItems[existingProductIndex].quantity + 1,
      //   };
      // } else {
      //   // If product is new, add it to the array
      //   updatedOrderItems.push(newItem);
      // }

      const updatedDataObject = {
        orderItems: updatedOrderItems,
        totalQuantity: newTotalQuantity,
        totalPrice: newTotalPrice,
        totalPayablePrice: newTotalPayablePrice,
        totalDiscountedPrice: newTotalDiscountedPrice,
      };

      const updatedState = {
        ...state,
        data: updatedDataObject,
        loading: false,
        error: null,
      };

      localStorage.setItem("directBuy", JSON.stringify(updatedDataObject));

      return updatedState;
    }

    case GET_DIRECTBUY:
      return {
        ...state,
        data: JSON.parse(localStorage.getItem("directBuy")),
        shipping_address:JSON.parse(localStorage.getItem('directAddress')),
        loading: false,
      };

    case INCREASE_QUANTITY_DIRECTBUY: {
      const colorId = action.payload.colorId;
    
      // Create a new array of orderItems with the updated quantity for the matched product
      const updateOrderItems = state.data.orderItems.map((product) => {
        if (product.colorOptionId === colorId) {
          const newQuantity = product.quantity + 1;
          return {
            ...product,
            quantity: newQuantity,
            mrp_price: product.product.mrp_price * newQuantity,
            selling_price: product.product.selling_price * newQuantity,
            discounted_price:
              (product.product.mrp_price - product.product.selling_price) * newQuantity,
          };
        }
        return product;
      });
    
      // Recalculate totals based on the updated orderItems
      const newTotalQuantity = updateOrderItems.reduce((acc, product) => acc + product.quantity, 0);
      const newTotalPrice = updateOrderItems.reduce((acc, product) => acc + product.mrp_price, 0);
      const newTotalPayablePrice = updateOrderItems.reduce((acc, product) => acc + product.selling_price, 0);
      const newTotalDiscountedPrice = newTotalPrice - newTotalPayablePrice;
    
      // Create the updated data object with the new totals
      const updatedDataObject = {
        ...state.data,  // Preserve other fields
        orderItems: updateOrderItems,
        totalQuantity: newTotalQuantity,
        totalPrice: newTotalPrice,
        totalPayablePrice: newTotalPayablePrice,
        totalDiscountedPrice: newTotalDiscountedPrice,
      };
    
      // Update localStorage with the new data
      localStorage.setItem("directBuy", JSON.stringify(updatedDataObject));
    
      // Return the updated state
      return {
        ...state,
        data: updatedDataObject,
        loading: false,
      };
    }
    case DECREASE_QUANTITY_DIRECTBUY: {
      const updateOrderitems = state.data.orderItems.map((product) => {
        if (product.colorOptionId === action.payload.colorId && product.quantity > 0) {
          return {
            ...product,
            quantity: product.quantity - 1,
            mrp_price: product.product.mrp_price * (product.quantity - 1),
            selling_price: product.product.selling_price * (product.quantity - 1),
            discounted_price: (product.product.mrp_price - product.product.selling_price) * (product.quantity - 1),
          };
        }
        return product;
      }).filter(product => product.quantity > 0); // Optional: remove products with 0 quantity
    
      // Update the total values
      const newTotalQuantity = updateOrderitems.reduce((acc, product) => acc + product.quantity, 0);
      const newTotalPrice = updateOrderitems.reduce((acc, product) => acc + product.mrp_price, 0);
      const newTotalPayablePrice = updateOrderitems.reduce((acc, product) => acc + product.selling_price, 0);
      const newTotalDiscountedPrice = newTotalPrice - newTotalPayablePrice;
    
      const updatedDataObject = {
        ...state.data,
        orderItems: updateOrderitems,
        totalQuantity: newTotalQuantity,
        totalPrice: newTotalPrice,
        totalPayablePrice: newTotalPayablePrice,
        totalDiscountedPrice: newTotalDiscountedPrice,
      };
    
      localStorage.setItem("directBuy", JSON.stringify(updatedDataObject));
    
      return {
        ...state,
        data: updatedDataObject,
        loading: false,
      };
    }
    case REMOVE_QUANTITY_DIRECTBUY: {
      const updateOrderitems = state.data.orderItems.filter(
        (product) => product.colorOptionId !== action.payload.colorId
      );

      const newTotalQuantity =
        updateOrderitems.length < 1
          ? 0
          : updateOrderitems.reduce((acc, product) => acc + product.quantity);
      const newTotalPrice =
        updateOrderitems.length < 1
          ? 0
          : updateOrderitems.reduce((acc, product) => acc + product.mrp_price);
      const newTotalPayablePrice =
        updateOrderitems.length < 1
          ? 0
          : updateOrderitems.reduce(
              (acc, product) => acc + product.selling_price
            );
      const newTotalDiscountedPrice =
        updateOrderitems.length < 1 ? 0 : newTotalPrice - newTotalPayablePrice;

      const updatedDataObject = {
        orderItems: updateOrderitems,
        totalDiscountedPrice: newTotalDiscountedPrice,
        totalPayablePrice: newTotalPayablePrice,
        totalPrice: newTotalPrice,
        totalQuantity: newTotalQuantity,
      };

      localStorage.setItem("directBuy", JSON.stringify(updatedDataObject));
     
      return {
        ...state,
        data: updatedDataObject,
        loading: false,
      };
    }

    case ADD_NEW_ADDRESS_DIRECTBUY:{
      const newAddress = action.payload;
      const updatedAddress = [newAddress]
      localStorage.setItem('directAddress',JSON.stringify(updatedAddress));
      return {
        ...state,
        shipping_address:updatedAddress
      }
    }

    default:
      return state;
  }
};

export default directBuy;
