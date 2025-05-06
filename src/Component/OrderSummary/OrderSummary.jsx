import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import css from "./ordersummary.module.css";
import { checkUser, formatNumberWithCommas } from "../../assest/js/checker";
import { useDispatch, useSelector } from "react-redux";
import ChangeUser from "./ChangeUser";
import { getProductDetails } from "../../action/productdetailaction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons/faLessThanEqual";
import ChangeAddress from "./ChangeAddress";
import { getOrderSummary, removeFromOrderSummary, updateOrderSummary } from "../../action/orderSummaryAction";
import Productdetail from "../Productdetail/productdetail";
import { retry } from "@reduxjs/toolkit/query";
import { RiFontSize } from "react-icons/ri";
import DirectForm from "./DirectForm";
import { DECREASE_QUANTITY_DIRECTBUY, GET_DIRECTBUY, INCREASE_QUANTITY_DIRECTBUY, REMOVE_QUANTITY_DIRECTBUY } from "../../action/actionType";

const OrderSummary = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userDetails = useSelector(state=>state?.getUser?.user)
    const user = checkUser()
    const [selectedAddress, setSelectedAddress ]= useState(null)
    const [modal , setModal] = useState(false);
    const [addressModal , setAddressModal] = useState(false)
    const [quantity ,setQuantity] = useState(1)
    const [updating, setUpdating] = useState(false)
    const productDetails = useSelector(state => state.OrderSummary?.data)
    const directBuy = useSelector(state=> state.directBuy.data)
    const directAddress = useSelector(state=>state.directBuy.shipping_address)

  useEffect(()=>{
    if(!updating){
      dispatch(getOrderSummary())
    }
  },[dispatch,updating])
    
  useEffect(()=>{
    if(!checkUser()){
      dispatch({
        type: GET_DIRECTBUY,
  
      })
    }
  },[])

  useEffect(() => {
    // Check if productDetails exist and orderItems are available
    if (checkUser() && productDetails?.orderItems?.length > 0) {
      
      let quantityPack = {};
      
      productDetails.orderItems.forEach(product => {
        if (product && product.colorOptionId) {
          quantityPack[product?.colorOptionId] = product?.quantity;
        }
      });
  
      setQuantity(prev => quantityPack);
    }
  
    // Check if directBuy exists and orderItems are available
    if (directBuy?.orderItems?.length > 0) {
      let quantityPack = {};
  
      directBuy.orderItems.forEach(product => {
        if (product && product.colorOptionId) {
          quantityPack[product.colorOptionId] = product.quantity;
        }
      });
  
     
      setQuantity(prev => quantityPack);
    }
  
  }, [productDetails, directBuy, checkUser]);
  
  

   useEffect(()=>{
    if(userDetails?.shipping_address.length > 0 ){
      console.log(userDetails,'user')
      setSelectedAddress(userDetails.shipping_address[0])
    }
   },[userDetails])
 
    const handleAddress = useCallback(()=>{
        setAddressModal(true)
    })
    const handleIncreaseQuantity = (productId,colorId,quantity) => {
      if(!checkUser()){
        setQuantity(state => ({
          ...state,
          [colorId]: (state[colorId] || 0) + 1
        }));
        dispatch({
          type: INCREASE_QUANTITY_DIRECTBUY,
          payload:{colorId,quantity:quantity+1}
        })

      }else{

        setUpdating(true)
        setQuantity(state => ({
          ...state,
          [colorId]: (state[colorId] || 0) + 1
        }));
        dispatch(updateOrderSummary(productId,colorId,quantity+1)).then(()=>{
          setUpdating(false)
        }).catch(()=>{
          setUpdating(false)
        })
      }
    }

    const handleDecreaseQuantity = (productId,colorId,quantity) => {
      if(!checkUser()){
        setUpdating(true)
        if(quantity ===1 ) return
        setQuantity(state => ({
         ...state,
         [colorId]: (state[colorId] || 0) - 1
       }));
       dispatch({
        type:DECREASE_QUANTITY_DIRECTBUY,
        payload:{colorId,quantity:quantity-1}
       })

      }else{

        setUpdating(true)
         if(quantity ===1 ) return
         setQuantity(state => ({
          ...state,
          [colorId]: (state[colorId] || 0) - 1
        }));
        dispatch(updateOrderSummary(productId,colorId,quantity-1)).then(()=>{
          setUpdating(false)
        }).catch(()=>{
          setUpdating(false)
        })
      }
    }

    const handleContinue = useCallback(()=>{
      navigate('/cart/ordersummary/checkout')
    },[])
   
    const handleRemove = useCallback((productId,colorId)=>{
      if(!checkUser()){
        dispatch({
          type:REMOVE_QUANTITY_DIRECTBUY,
          payload:{colorId}
        })

      }else{

        setUpdating(true)
        dispatch(removeFromOrderSummary(productId,colorId)).then(()=>{
          setUpdating(false)
        }).catch(()=>{
          setUpdating(false)
        })
      }

    },[dispatch])
   

    if(!checkUser()){

      return(
        <section className={css.maincontainer}>
      <section className={css.leftcontainer}>
        <div className={css.box}>
          <main>
            <div>
              <p className="text-primary">1</p>
            </div>
            <div className={`${css.textcontent}`}>
              <h5 className="">LOGIN</h5>
              <p>
                want to Login
              </p>
            </div>
          </main>
          <div className={css.buttonContent}>
            <Link to={'/login'}>Login</Link>
          </div>
        </div>
             
              {/* <div className={css.box}>
                <main>
                  <div>
                    <p className="text-primary">2</p>
                  </div>
                  <div className={`${css.addresscontent}`}>
                    <h5 className="">DELIVERY ADDRESS</h5>
                  </div>
                </main>
            
              </div> */}
                <div className="mt-4 " style={{width:'100%'}}>

                    <DirectForm/>
                </div>
          
        <div className={css.summarybox}>
          <div>
            <p>3</p>
            <p>Order summary</p>
          </div>
          {directBuy.orderItems && directBuy.orderItems.length > 0 && directBuy.orderItems.map(product=>{
            return (
              <main key={ product && product.colorOptionId}>
                <div>
                  <img src={product.product && product.product.productImage} alt="" />
                </div>
                <section>
                  <div className={css.toptext}>
                    <main>
                    <div className={css.productnames}>
                        <p>{product.product && product.product.product_name}</p>
                        <p>{product.product && product.product.category}</p>
                        
                      </div>
                       
                      
                    </main>
                    <div>
                      <p>delivery is by 5th august</p>
                    </div>
                  </div>
                  <div className={css.priceoffer}>
                    <p>₹{product.product && product.product.mrp_price}</p>
                    <p>₹{product.product && product.product.selling_price}</p>
                    <p>{product.product && (((product.product.mrp_price - product.product.selling_price)/product.product.mrp_price)*100).toFixed(0)}% OFF</p>
                  </div>
                  <div className={css.summarybutns}>
                    <div className={css.quantityBox}>
                    
                    <CiSquareMinus size={34} onClick={()=>handleDecreaseQuantity(product.product._id, product.colorOptionId, product.quantity)}/>
                    
                    <p className={css.statQuantity} style={{fontVariantNumeric:'tabular-nums'}}>{product.product &&  quantity[ product.colorOptionId]}</p>
                    
                    <CiSquarePlus size={34} onClick={()=>handleIncreaseQuantity(product.product._id, product.colorOptionId, product.quantity)}/>
                    
                    <button onClick={()=>handleRemove(product.product._id, product.colorOptionId)}>Remove</button>
                    </div>
                    <Link to={'/'}>Back to shopping</Link>
                  </div>
                </section>
              </main>
            )
          })}
        </div>

        <div className={css.continueSec}>
          <p>order confirmation will be sent to registered mobile number</p>
         {directAddress && directAddress.length >0 ? <button onClick={handleContinue}>continue</button> :<button onClick={()=>window.scroll(100,0)}>continue</button>}
        </div>
      </section>
      {productDetails && 
      <section className={css.priceDetails}>
        <div>
          <h4>price details</h4>
        </div>
        <main>
          <div className={css.priceTop}>
            <p>
              <span> price (item:{directBuy.totalQuantity}) </span> <span>₹{directBuy.totalPrice}</span>
            </p>
            <p>
              <span>delivery charges</span>
              <span className="text-success">free</span>
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{textTransform:"capitalize",fontWeight:500}}>discounted Price</p>
            <p className="text-success" style={{fontWeight:400}}>₹{directBuy&&directBuy.totalDiscountedPrice}</p>
          </div>
          <div className={css.total}>
            <p>total payable</p>
            <p>₹{directBuy.totalPayablePrice &&  formatNumberWithCommas(directBuy.totalPayablePrice)}</p>
          </div>
          <div className={css.savings}>
            <p className="text-success">
              your total savings on this order is ₹{directBuy&& (directBuy.totalDiscountedPrice)}
            </p>
          </div>
        </main>
      </section>}
    </section>
      )
    }

  return (
    <section className={css.maincontainer}>
      <section className={css.leftcontainer}>
        <div className={css.box}>
          <main>
            <div>
              <p className="text-primary">1</p>
            </div>
            <div className={`${css.textcontent}`}>
              <h5 className="">LOGIN</h5>
              <p>
                <span className="flex-nowrap">{userDetails && userDetails.name }</span>{userDetails && userDetails.mobile}
              </p>
            </div>
          </main>
          <div className={css.buttonContent}>
            <button onClick={()=>setModal(true)}>change</button>
          </div>
        </div>
             {selectedAddress ?( 
              <div className={css.box}>
                <main>
                  <div>
                    <p className="text-primary">2</p>
                  </div>
                  <div className={`${css.addresscontent}`}>
                    <h5 className="">DELIVERY ADDRESS</h5>
                    <p className={css.address}>
                      <span>{selectedAddress.fullName}</span> -<span>{selectedAddress.mobile}</span> ,{selectedAddress.billing_address}  <span>pinCode:{selectedAddress.pinCode}</span>
                    </p>
                  </div>
                </main>
                <div className={css.buttonContent}>
                  <button onClick={handleAddress}>change</button>
                </div>
              </div>
            ):(
              <div className={css.box}>
              <main>
                <div>
                  <p className="text-primary">2</p>
                </div>
                <div className={`${css.addresscontent}`}>
                  <h5 className="">DELIVERY ADDRESS</h5>
                  <p className={`${css.address} text-danger`} style={{fontWeight:500}}>
                    please add address 
                  </p>
                </div>
              </main>
              <div className={css.buttonContent}>
                <Link to={'/profile/address'} style={{fontSize:'.9rem',fontWeight:700,border:'solid lightgray 2px',padding:'3px 5px'}}>Add Address</Link>
              </div>
            </div>
            )}
        <div className={css.summarybox}>
          <div>
            <p>3</p>
            <p>Order summary</p>
          </div>
          {productDetails.orderItems && productDetails.orderItems.length > 0 && productDetails.orderItems.map(product=>{
            return (
              <main key={ product && product.colorOptionId}>
                <div>
                  <img src={product.product && product.product.productImage} alt="" />
                </div>
                <section>
                  <div className={css.toptext}>
                    <main>
                      <div className={css.productnames}>
                        <p>{product.product && product.product.product_name}</p>
                        <p>{product.product && product.product.category}</p>
                      </div>
                      <p>seller : name</p>
                    </main>
                    <div>
                      <p>delivery is by 5th august</p>
                    </div>
                  </div>
                  <div className={css.priceoffer}>
                    <p>₹{product.product && product.product.mrp_price}</p>
                    <p>₹{product.product && product.product.selling_price}</p>
                    <p>{product.product && (((product.product.mrp_price - product.product.selling_price)/product.product.mrp_price)*100).toFixed(0)}% OFF</p>
                  </div>
                  <div className={css.summarybutns}>
                    <div className={css.quantityBox}>
                    
                    <CiSquareMinus size={34} onClick={()=>handleDecreaseQuantity(product.product._id, product.colorOptionId, product.quantity)}/>
                    
                    <p className={css.statQuantity} style={{fontVariantNumeric:'tabular-nums'}}>{ product &&  quantity[ product.colorOptionId]}</p>
                    
                    <CiSquarePlus size={34} onClick={()=>handleIncreaseQuantity(product.product._id, product.colorOptionId, product.quantity)}/>
                    
                    <button onClick={()=>handleRemove(product.product._id, product.colorOptionId)}>Remove</button>
                    </div>
                    <Link to={'/'}>Back to shopping</Link>
                  </div>
                </section>
              </main>
            )
          })}
        </div>

        <div className={css.continueSec}>
          <p>order confirmation will be sent to registered mobile number</p>
         {selectedAddress ? <button onClick={handleContinue}>continue</button> :<button onClick={()=>window.scroll(100,0)}>continue</button>}
        </div>
      </section>
      {productDetails && 
      <section className={css.priceDetails}>
        <div>
          <h4>price details</h4>
        </div>
        <main>
          <div className={css.priceTop}>
            <p>
              <span> price (item:{productDetails.totalQuantity}) </span> <span>₹{productDetails.totalPrice}</span>
            </p>
            <p>
              <span>delivery charges</span>
              <span className="text-success">free</span>
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{textTransform:"capitalize",fontWeight:500}}>discounted Price</p>
            <p className="text-success" style={{fontWeight:400}}>₹{productDetails&&productDetails.totalDiscountedPrice}</p>
          </div>
          <div className={css.total}>
            <p>total payable</p>
            <p>₹{productDetails.totalPayablePrice &&  formatNumberWithCommas(productDetails.totalPayablePrice)}</p>
          </div>
          <div className={css.savings}>
            <p className="text-success">
              your total savings on this order is ₹{productDetails&& (productDetails.totalDiscountedPrice)}
            </p>
          </div>
        </main>
      </section>}
      {userDetails ? (
        <>
            {modal ? (
                <ChangeUser user={userDetails} setModal={setModal}/>
            )  : (
                null
            )}
          { addressModal ?  (
            <ChangeAddress userDetails={userDetails} setModal={setAddressModal} currentAdress={selectedAddress} setSelectedAddress={setSelectedAddress}/>
          ):(null)}
        </>
          
      
      ):(
        null
      )}
    </section>
  );
};

export default OrderSummary;
