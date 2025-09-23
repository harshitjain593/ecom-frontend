import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import productReducer from './productReducer';
import productdetailReducer from './productdetailReducer';
import categoryReducer from './categoryReducer';
import getCartReducer from './getCart';
import SearchResultReducer from './searchlistReducer';
import getWhishlistReducer from './getWishlistReducer';
import getUserReducer from './getUserDetailsReducer';
import recentProuductsReducer from './recentProductsReducer';
import filterReducer from './filterReducer';
import orderSummaryReducer from './orderSummary';
import orderDetailsReducer from './orderedDetails';
import authreducer from './authreducer';
import { forgotPassword } from '../action/authaction';
import registerReducer from './Registeration';
import { checkDelivery } from '../action/Delivery';
import { CheckDeliveryReducer } from './checkDelivery';
import MyordersReducer from './myOrder';
import singleOrder from './singleOrder';
import newProductsReducer from './newProducts';
import registeredUser from './registeredUser';
import compareReducer from './compare';
import directBuy from './directBuy';
import statesData from './stateDataReducer';
import FilterData from './FilterDatas';
import trackingReducer from './trackingData';



const rootReducer = combineReducers({
    data: dataReducer,
    registeredUser:registeredUser,
    registerVerify:registerReducer,
    forgotPasswordData:authreducer,
    productData: productReducer,
    productDetails: productdetailReducer,
    categories:categoryReducer,
    CartData : getCartReducer,
    searchResult:SearchResultReducer,
    WishlistData:getWhishlistReducer,
    getUser:getUserReducer,
    recentProducts:recentProuductsReducer,
    filteredProducts:filterReducer,
    OrderSummary:orderSummaryReducer,
    orderDetails:orderDetailsReducer,
    checkDelivery:CheckDeliveryReducer,
    myOrder:MyordersReducer,
    singleOrder:singleOrder,
    bestProducts:newProductsReducer,
    compare:compareReducer,
    directBuy:directBuy,
    statesData:statesData,
    filterData:FilterData,
    trackingData:trackingReducer,
});

export default rootReducer;
