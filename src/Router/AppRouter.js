// src/router/AppRouter.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Component/Home';
import About from '../Component/About';
import NotFound from '../Component/NotFound/404NotFound';
import Header from '../Component/Common/Header/Header';
import Footer from '../Component/Common/Footer/Footer';
import Login from '../Component/Auth/Login/login';
import Register from '../Component/Auth/Register/register';
import Viewcart from '../Component/Viewcart/viewcart';
import Shop from '../Component/Shop/shop';
import Checkout from '../Component/Checkout/checkout';
import Productdetail from '../Component/Productdetail/productdetail';
import Payment from '../Component/Payment/payment';
import Forgot from '../Component/Auth/Forgot/forgot';
import PrivacyPolicy from '../Component/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from '../Component/TermsAndConditions/TermsOfService';
import Whishlist from '../Component/Whislist/Whishlist';
import LogoutUser from '../Component/Auth/Logout/logout';
import SearchResult from '../Component/SearchResult/SearchResult';
import CategoryResult from '../Component/CatagoryResult/CatagoryResult';
import FilterResultPage from '../Component/FilterReulst/FilterResultPage';
import OrderSummary from '../Component/OrderSummary/OrderSummary';
import MangaeAdress from '../Component/ManageAdress/MangaeAdress';
import UpdateAddress from '../Component/UpdateAddress/UpdateAddress';
import OrderPage from '../Component/orders page/OrdersPage';
import ResetPasswords from '../Component/Auth/Forgot/ResetPassword';
import ProtectedRoute from '../Component/protectedRoute/ProtectedRoute';
import OrderDetails from '../Component/orderDetailsPage/OrderDetails';
import ReviewandRatingsPage from '../Component/Reviews and ratings/ReviewandRatingsPage';
import Faq from '../Component/Faq/Faq';
import Profile from '../Component/Profile/Profile';
import ContactUs from '../Component/contact me/ContactUs';
import ComaparePage from '../Component/Compare page/ComaparePage';
import OrderTracking from '../Component/trackingOrder/OrderTracking';

function AppRouter() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/privacy' element={<PrivacyPolicy />} />
                <Route path='/termsandcondition' element={<TermsOfService />} />
                <Route path='/cart' element={<Viewcart />} />
                <Route path='/profile/address' element={<MangaeAdress />} />
                <Route path='/profile/updateaddress/:id' element={<UpdateAddress />} />
                <Route path='/logout' element={<LogoutUser />} />
                <Route path='/result/:id' element={<SearchResult />} />
                <Route path='/filtered/:id' element={<FilterResultPage />} />
                <Route path='/shop' element={<Shop />} />
                <Route path='/cart/ordersummary/checkout' element={<Payment />} />
                <Route path='/user/orders' element={<OrderPage />} />
                <Route path='/category/:id' element={<CategoryResult />} />
                <Route path='/productdetail/:id' element={<Productdetail />} />
                <Route path='/payment' element={<Payment />} />
                <Route path='/wishlist' element={<Whishlist />} />
                <Route path='/cart/ordersummary' element={<OrderSummary />} />
                <Route path={`/user/orders/:id`} element={<OrderDetails/>}/>
                <Route path='/product/review/:id' element={<ReviewandRatingsPage/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/faq' element={<Faq/>}/>
                <Route path='/contact' element={<ContactUs/>}/>
                <Route path='/compare' element={<ComaparePage/>}/>
                <Route path='/user/orders/tracking' element={<OrderTracking/>}/>
                {/* Protected route for resetting password */}
                <Route path='/resetpassword' element={
                    <ProtectedRoute>
                        <ResetPasswords />
                    </ProtectedRoute>
                } />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default AppRouter;
