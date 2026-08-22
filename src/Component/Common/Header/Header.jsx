import { SearchBar } from './SearchBar';
import React, { useEffect, useState } from 'react';
import { Link, useAsyncError } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './header.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../../action/getCartAction';
import { getWishlist } from '../../../action/wishListAciton';
import { getUser } from '../../../action/authaction';
import { FaRegUserCircle } from 'react-icons/fa';
import LoginPOP from '../../Loginbutton/LoginPOP';
import BrandWordmark from '../BrandWordmark';
import CategoryNav from './CategoryNav';
import MobileCategoryMenu from './MobileCategoryMenu';
import { getCategory } from '../../../action/categoryAction';
import { checkUser } from '../../../assest/js/checker';
import { FILTER_UPDATE_STATE } from '../../../action/actionType';





function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {pathname }= useLocation();
  const cartQuantity = useSelector(state=>state?.CartData?.data?.totalQuantity)
  const wishListQuantity = useSelector(state=>state?.WishlistData?.data?.totalItem)
  const currentURL = pathname;
  const user = useSelector(state => state?.getUser?.user)
  const dispatch = useDispatch();
  const [users ,setUsers] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);
  const opensidebar = useSelector(state=>state.filterData.sidebarOpen);
  const categoriesState = useSelector(state => state.categories);
  

  useEffect(()=>{
    const matchDynamicRoute = (pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    };

    if (
      matchDynamicRoute('^/result/.+') ||
      matchDynamicRoute('^/category/.+') ||
      matchDynamicRoute('^/filtered/.+') ||
      pathname === '/shop'
    ) {
      setActiveFilter(true);
    } else {
      setActiveFilter(false);
      setSidebarOpen(false)
    }
  }, [pathname]);
  
 useEffect(() => {
  if (checkUser()) {
    dispatch(getCart());
    dispatch(getWishlist());
  }
 }, [dispatch, pathname]);

  useEffect(() => {
    if (checkUser()) {
      setUsers(true);
    } else {
      setUsers(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!user && checkUser()) {
      dispatch(getUser());
    }
    dispatch(getCategory());
  }, [dispatch, user]);
  

  if (
    currentURL === '/login' ||
    currentURL === '/register' ||
    currentURL === '/forgot'
  ) {
    return null
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleSidebar = () => {
    setIsOpen(false)
    dispatch({
      type:FILTER_UPDATE_STATE,
      payload:{
          sidebarOpen:!opensidebar
      }})
  };



  const handleCloseSidebar = ()=>{
    dispatch({
        type:FILTER_UPDATE_STATE,
        payload:{
            sidebarOpen:false
        }
    })
}
 
  


  return (
    <>
      <header className="gi-header">
        <div className="header-top">
          <div className="container-fluid">
            <div className="row align-itegi-center">
              <div className="col text-left header-top-left d-lg-block">
                <div className="header-top-social">
                  <div className="header-top-message">
                    World's Fastest Online Shopping Destination
                  </div>

                </div>
              </div>
              <div className="col text-center header-top-center">
              </div>
              <div className="col header-top-right d-none d-lg-block">
                <div className="header-top-right-inner d-flex justify-content-end">
                  <Link className="gi-help" to="/contact">Help?</Link>
                  <Link className="gi-help" to="/user/orders/tracking">Track Order?</Link>
                </div>
              </div>
              <div className="col header-top-res d-lg-none">
                <div className="gi-header-bottons">
                  <div className="right-icons">
                    {/* Profile icon hidden on mobile - moved to second header */}
                    <Link to="login.html" className="gi-header-btn gi-header-user d-none">
                      <div className="header-icon"><i className="fa-regular fa-user"></i></div>
                    </Link>
                    {/* Wishlist and cart icons moved to second header on mobile */}
                    <Link to="/wishlist" className="gi-header-btn gi-wish-toggle d-none">
                      <div className="header-icon"><i className="fa-regular fa-heart"></i></div>
                      {wishListQuantity > 0 &&<span className="gi-header-count gi-wishlist-count">{wishListQuantity || 0}</span>}
                    </Link>
                    <Link to="/cart" className="gi-header-btn gi-cart-toggle d-none">
                      <div className="header-icon"><i className="fa-solid fa-cart-shopping"></i>
                        <span className="main-label-note-new"></span>
                      </div>
             {cartQuantity > 0 &&  <span className="gi-header-count gi-cart-count">{cartQuantity? cartQuantity :0}</span>}
                    </Link>
                    {/* Hamburger menu moved to second header on mobile */}
                    <button onClick={toggleSidebar} className="gi-header-btn gi-site-menu-icon d-none">
                      <i className="fa-solid fa-bars"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header with Icons - appears on all pages */}
        <div className="d-lg-none mobile-header-icons">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-3">
                <button onClick={toggleSidebar} className="gi-header-btn gi-site-menu-icon">
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
              <div className="col-6 text-center">
                <div className="header-logo">
                  <BrandWordmark variant="mobile" />
                </div>
              </div>
              <div className="col-3">
                <div className="d-flex justify-content-end">
                  <Link to="/wishlist" className="gi-header-btn gi-wish-toggle me-2">
                    <div className="header-icon"><i className="fa-regular fa-heart"></i></div>
                    {wishListQuantity > 0 &&<span className="gi-header-count gi-wishlist-count">{wishListQuantity || 0}</span>}
                  </Link>
                  <Link to="/cart" className="gi-header-btn gi-cart-toggle">
                    <div className="header-icon"><i className="fa-solid fa-cart-shopping"></i>
                      <span className="main-label-note-new"></span>
                    </div>
                    {cartQuantity > 0 &&  <span className="gi-header-count gi-cart-count">{cartQuantity? cartQuantity :0}</span>}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - appears on all pages */}
        <div className="d-lg-none mobile-search-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="mobile-search-bar">
                  <SearchBar SidebarOpen={SidebarOpen} handleCloseSidebar={handleCloseSidebar} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - appears on all pages */}
        {isSidebarOpen && (
          <div className="sidebar">
            <button onClick={toggleSidebar} className="close-btn">&times;</button>
            <nav>
              <MobileCategoryMenu categoriesState={categoriesState} />
              <ul>
                { user ? (
                  <>
                    <li><Link to="/profile"><i className="fa-regular fa-user me-2"></i>Profile</Link></li>
                    <li><Link to="/user/orders"><i className="fa-solid fa-box me-2"></i>Orders</Link></li>
                    <li><Link to="/wishlist"><i className="fa-regular fa-heart me-2"></i>Wishlist</Link></li>
                    <li><Link to="/cart"><i className="fa-solid fa-cart-shopping me-2"></i>Cart</Link></li>
                    <li><Link to="/logout"><i className="fa-solid fa-sign-out-alt me-2"></i>Logout</Link></li>
                  </>

                ) :(
                  <>
                    <li><Link to="/login"><i className="fa-solid fa-sign-in-alt me-2"></i>Login</Link></li>
                    <li><Link to="/register"><i className="fa-solid fa-user-plus me-2"></i>Register</Link></li>
                    <li><Link to="/wishlist"><i className="fa-regular fa-heart me-2"></i>Wishlist</Link></li>
                    <li><Link to="/cart"><i className="fa-solid fa-cart-shopping me-2"></i>Cart</Link></li>
                  </>
                )}
             
              </ul>
            </nav>
          </div>
        )}

        <div className="gi-header-bottom d-lg-block">
          <div className="container-fluid position-relative">
            <div className="row">
              <div className="gi-flex">
                <div className="align-self-center gi-header-logo">
                  <div className="header-logo">
                    <BrandWordmark variant="header" />
                  </div>
                  
                </div>
                <div className="align-self-center gi-header-search">
                  <div className="header-search ">
              <SearchBar   SidebarOpen={SidebarOpen} handleCloseSidebar={handleCloseSidebar}  />

                  </div>
                </div>
                <div className="gi-header-action align-self-center">
                  <div className="gi-header-bottons">
                    {/* <!-- Header User Start --> */}
                  {/* {user?(
                     <Link to="/" className="gi-header-btn gi-wish-toggle" title="home">
                     <div className="gi-btn-desc d-flex flex-col align-items-end py-2 justify-content-center " style={{gap:'8px', }}>
                     <FaRegUserCircle color=' #EDB70B ' size={23}  className='text-center align-self-center'/>
                       <span className="gi-btn-stitle" style={{ color: "#EDB70B" }}>{user.name}</span>
                     </div>
                   </Link>
                  ):(
                    null
                  )} */}
                    <div className="gi-acc-drop">
                      <Link to="/" className="gi-header-btn mt-1 gi-header-user dropdown-toggle gi-user-toggle"
                        title="Account">
                        <div className="gi-btn-desc">
                         {user ? (
                          <div className='justify-content-center align-items-center w-100 text-center'>

                            <img src={user.profile_image?user.profile_image : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="} alt=""  style={{width:'32px' ,height:'auto',borderRadius:'50% '}}/>
                          </div>
                         ):(
                         <i className="fa-regular fa-user text-center py-2 gi-header-icon"></i>
                         )}
                          <span className="gi-btn-stitle text-center mt-0 gi-header-label">{user ? user.name : 'Profile'}</span>
                        </div>
                      </Link>
                      
                      <ul className="gi-dropdown-menu">
                        {user ? (
                          <>
                             <li><Link className="dropdown-item" to="/logout">logout</Link></li>
                             <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                             <li><Link className="dropdown-item" to="/user/orders">Orders</Link></li>
                          </>

                        ):(
                          <>
                          <li><Link className="dropdown-item" to="/register">Register</Link></li>
                          <li><Link to={"/login"}>Login</Link></li>
                          </>
                        )}
                     
                      </ul>
                    </div>
                   
                    <Link to="/wishlist" className="gi-header-btn gi-wish-toggle" title="Wishlist">
                      <div className="gi-btn-desc">
                    {wishListQuantity > 0 &&  <span className=" badge-ab ">{wishListQuantity || 0}</span>}
                        <i className="fa-regular fa-heart text-center py-2 gi-header-icon"></i>
                        <span className="gi-btn-stitle gi-header-label">wishlilst</span>
                      </div>
                    </Link>
                    <Link to="/cart" className="gi-header-btn gi-cart-toggle" title="Cart">
                      <div className="gi-btn-desc">
                    {cartQuantity > 0 &&  <span className=" badge-ab ab-2 ">{cartQuantity? cartQuantity :0}</span>}
                        <i className="fa-solid fa-bag-shopping text-center py-2 gi-header-icon"></i>
                        <span className="gi-btn-stitle gi-header-label">Cart</span>
                      </div>
                    </Link>
                   {activeFilter && <div className="gi-header-action align-self-center" style={{cursor:"pointer"}}>      
                      <div className="px-2 d-flex justify-content-center px-3" style={{ padding: "5px 0px" ,cursor:"pointer" }} 
                        onClick={handleToggleSidebar}>
                        <span className="gi-btn-stitle text-center p-1 gi-header-label" style={{ marginRight:'2px', fontSize:'.8rem' }}>FILTER</span>
                        <img src="/img/Vector.png" alt="" className='d-flex justify-content-center position-relative align-top ' style={{ width: "22px", top: "5px", height: "20px" }} />
                      </div>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CategoryNav />

      
     
      </header>
    </>
  )
}
export default Header;


