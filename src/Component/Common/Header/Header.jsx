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
  

  useEffect(()=>{
    const matchDynamicRoute = (pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    };

    if (
      matchDynamicRoute('^/result/.+') ||
      matchDynamicRoute('^/category/.+') ||
      matchDynamicRoute('^/filtered/.+')
    ) {
      setActiveFilter(true);
    } else {
      setActiveFilter(false);
      setSidebarOpen(false)
    }
  }, [pathname]);
  
 useEffect(()=>{
  if(!cartQuantity){
    getCart();
  }
  if(!wishListQuantity){

    getWishlist();
  }
 },[cartQuantity,wishListQuantity])

  useEffect(()=>{
    if(checkUser()){
      setUsers(true)
    }else{
      setUsers(false)
    }
    dispatch(getCart())
    dispatch(getWishlist())
  },[dispatch ,wishListQuantity,cartQuantity])

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  
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
                    <Link to="login.html" className="gi-header-btn gi-header-user">
                      <div className="header-icon"><i className="fa-regular fa-user"></i></div>
                    </Link>
                    <Link to="/wishlist" className="gi-header-btn gi-wish-toggle">
                      <div className="header-icon"><i className="fa-regular fa-heart"></i></div>
                      {wishListQuantity > 0 &&<span className="gi-header-count gi-wishlist-count">{wishListQuantity || 0}</span>}
                    </Link>
                    <Link to="/cart" className="gi-header-btn gi-cart-toggle">
                      <div className="header-icon"><i className="fa-solid fa-cart-shopping"></i>
                        <span className="main-label-note-new"></span>
                      </div>
             {cartQuantity > 0 &&  <span className="gi-header-count gi-cart-count">{cartQuantity? cartQuantity :0}</span>}
                    </Link>
                    <button onClick={toggleSidebar} className="gi-header-btn gi-site-menu-icon d-lg-none">
                      <i className="fa-solid fa-bars"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isSidebarOpen && (
            <div className="sidebar">
              <button onClick={toggleSidebar} className="close-btn">&times;</button>
              <nav>
                <ul>
                  <div className="category-dropdown px-2">
                  {activeFilter?( <li className="d-flex justify-content-between text-black border-bottom" onClick={handleToggleSidebar}>Shop by Filter
                      <span>{isOpen ? '+' : '+'}</span>
                    </li>):''}
                    {/* {isOpen && (
                      <div className="dropdown">
                        <ul>
                          <li><Link to="/">Bone China</Link></li>
                          <li><Link to="/">Wooden</Link></li>
                          <li><Link to="/">Ceramic</Link></li>
                        </ul>
                      </div>
                    )} */}
                  </div>
                 
                  { user ? (
                    <>
                      <div className="px-2">
                        <li className="border-bottom"><Link to="/logout">Logout</Link></li>
                      </div>
                      <div className="px-2">
                      <li className="border-bottom"><Link to="/user/orders">Orders</Link></li>
                      </div>
                      <div className="px-2">
                      <li className="border-bottom"><Link to="/profile">Profile</Link></li>
                      </div>
                    </>

                  ) :(
                    <section>

                      <div className="px-2">
                      <li className="border-bottom"><Link to="/login">Login</Link></li>
                     </div>
                      <div className="px-2">
                      <li className="border-bottom"><Link to="/register">Register</Link></li>
                     </div>
                    </section>
                    
                     
                  )}
             
                </ul>
              </nav>
            </div>
          )}
        </div>

        <div className="gi-header-bottom d-lg-block">
          <div className="container-fluid position-relative">
            <div className="row">
              <div className="gi-flex">
                <div className="align-self-center gi-header-logo">
                  <div className="header-logo">
                    <Link to="/"><img src="https://harshitj593.s3.eu-north-1.amazonaws.com/Oluxe-logo-transparent.png" alt="Oluxe Logo" style={{ width: "130px", height: "120px" }} /></Link>
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
                         <i className="fa-regular fa-user text-center py-2" style={{ color: "#EDB70B" }}></i>
                         )}
                          <span className="gi-btn-stitle text-center mt-0" style={{ color: "#EDB70B",textAlign:'start' }}>{user ? user.name : 'Profile'}</span>
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
                        <i className="fa-regular fa-heart text-center py-2" style={{ color: "#EDB70B", }}></i>
                        <span className="gi-btn-stitle" style={{ color: "#EDB70B" }}>wishlilst</span>
                      </div>
                    </Link>
                    <Link to="/cart" className="gi-header-btn gi-cart-toggle" title="Cart">
                      <div className="gi-btn-desc">
                    {cartQuantity > 0 &&  <span className=" badge-ab ab-2 ">{cartQuantity? cartQuantity :0}</span>}
                        <i className="fa-solid fa-bag-shopping text-center py-2" style={{ color: "#EDB70B" }}></i>
                        <span className="gi-btn-stitle" style={{ color: "#EDB70B" }}>Cart</span>
                      </div>
                    </Link>
                   {activeFilter && <div className="gi-header-action align-self-center" style={{cursor:"pointer"}}>      
                      <div className="px-2 d-flex justify-content-center px-3" style={{ padding: "5px 0px" ,cursor:"pointer" }} 
                        onClick={handleToggleSidebar}>
                        <span className="gi-btn-stitle text-center p-1" style={{ color: "#EDB70B", marginRight:'2px', fontSize:'.8rem' }}>FILTER</span>
                        <img src="/img/Vector.png" alt="" className='d-flex justify-content-center position-relative align-top ' style={{ width: "22px", top: "5px", height: "20px" }} />
                      </div>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      
     
      </header>
    </>
  )
}
export default Header;


