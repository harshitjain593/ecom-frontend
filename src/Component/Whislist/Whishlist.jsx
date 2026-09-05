import { CheckUserComponent } from '../Auth/checkComponent/CheckUserComponent';
import React, { useCallback, useEffect, useState } from "react";
import './whishlist.css'
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../action/wishListAciton";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../service/api";
import { MOVE_TO_CART } from "../../action/actionType";
import { toast } from "react-toastify";
import { checkUser } from "../../assest/js/checker";
import { findCartItem } from "../../utils/cartUtils";
import { getCart } from "../../action/getCartAction";

const Whishlist = () => {
    const navigate = useNavigate()
    const [loggedIn , setLoggedIn] = useState(checkUser())    
    console.log(checkUser(),'user') 
    const wishlistData = useSelector(state =>state?.WishlistData?.data )
    const cartItems = useSelector(state => state?.CartData?.data?.cartItems)
    const dispatch = useDispatch()
    
    const RemoveFromWishlist = useCallback((productId)=>{
        dispatch(removeFromWishlist(productId))
    },[dispatch ])

  useEffect(()=>{
   dispatch(getWishlist())
   if (checkUser()) {
     dispatch(getCart())
   }
  },[dispatch])

  const MoveToCarts = useCallback(async(productId)=>{
    try {
         const token = localStorage.getItem('token');
         if (!token) {
             // toast.error('please login');
             return;
         }
 
         const response = await fetch(`${API_URL}/mobileApi/cart/move-product-to-cart/${productId}`, {
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
                 dispatch(getCart());
             } else {
                 toast.error('error in check wishlist', result);
             }
         } else {
             const errorData = await response.data;
             throw new Error(errorData.message || 'error in check wishlist request');
         }
     } catch (error) {
         toast.error(error.message);
         console.log(error);
     }
   }, [dispatch])

  const handleMoveToCart = useCallback((id)=>{
    MoveToCarts(id)
  },[MoveToCarts])

  const handleNavigate = useCallback(()=>{
    navigate('/login')
  }, [navigate])
  
 



  return(
    <>
    {loggedIn ? (
          <section>
          <div className="wish-banner position-relative"> 
              <div className="wishlist-head position-absolute " >
                <h2 >Wishlist</h2>
                <p>Mastery of Handcrafts</p>
  
              </div>
            
          </div>
          {wishlistData && wishlistData.products && wishlistData.products.length > 0 ? (
          <main className="wishlist-list">
            <table className="table table-align-middle">
              <thead>
                  <tr className="table-head-tr">
                      <th className="cls-btn"></th>
                      <th className="wish-thumb"></th>
                      <th className="max-sm"></th>
                      <th className="min-lg">product name</th>
                      <th className="min-lg">Unit price</th>
                      <th className="min-xl">stock status</th>
                      <th className="min-lg"></th>
                  </tr>
              </thead>
              <tbody className="table-group-divider">
                  {wishlistData.products.map((product)  => {
                      const inCart = Boolean(findCartItem(cartItems, product._id, null));
                      return (
                      <tr className="align-middle tr" key={product._id}>
                          <td><MdClose size={25}  className="x-close"  onClick={()=>RemoveFromWishlist(product._id)}/></td>
                          <td>
                            {product.productImage ? (
                              <img style={{width:'14rem'}} src={product.productImage} alt={product.product_name || ''} />
                            ) : (
                              <div className="wishlist-img-fallback">No image</div>
                            )}
                          </td>
                          <td className="max-sm">
                              <div>
                                  <p>{product.product_name || 'Product unavailable'}</p>
                                  <p>₹{product.selling_price ?? '—'}</p>
                                  {inCart ? (
                                    <Link to="/cart">In cart — Go to Cart &rarr;</Link>
                                  ) : (
                                    <button onClick={()=>handleMoveToCart(product._id)}>Add to Cart &rarr;</button>
                                  )}
                              </div>
                          </td>
                          <td className="min-lg">{product.product_name || 'Product unavailable'}</td>
                          <td className="min-lg">₹{product.selling_price ?? '—'}</td>
                          <td className="min-xl">{ product.stock_quantity > 0 || product.remaining_quantity > 0 ? 'In stock' : 'not available'}</td>
                          <td className="min-lg">
                            {inCart ? (
                              <Link to="/cart">In cart <span className="btn-arrow">&rarr;</span></Link>
                            ) : (
                              <button onClick={()=>handleMoveToCart(product._id)}>Add to Cart <span className="btn-arrow">&rarr;</span></button>
                            )}
                          </td>
                      </tr>
                  )})}
                
              </tbody>
            </table>
  
          </main>
          ):(
              <div className="mt-2 text-center">
                  <p className="text-center fs-4 text-black">No products in wihslist Continue shopping</p>
                  <button className="badge text-bg-warning py-2 py-3 fs-5"
                  onClick={()=>{navigate('/')}}> shop now</button>
              </div>
          )}
      </section>
    ) :(
      <CheckUserComponent    >
        <div className='mt-4 d-flex flex-column  justify-center' style={{color:'black'}}>
        <p  className='text-center' style={{fontWeight:500}}>Missing Wishlist items?</p>
        <p className='text-center' style={{fontWeight:300}}>Login to see the items you added previously</p>
        <button className='btn  px-4' onClick={handleNavigate}> login</button>
        </div>

      </CheckUserComponent>
    )}
  
    </>
  )
};

export default Whishlist;
