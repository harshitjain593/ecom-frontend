import React, { useCallback, useEffect, useState } from "react";
import "./viewcart.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCartQuantity } from "../../action/productdetailaction";
import { getCart, removeFromCart } from "../../action/getCartAction";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { CartToOrderSummary } from "../../action/orderSummaryAction";
import { checkUser, formatNumberWithCommas } from "../../assest/js/checker";
import { CheckUserComponent } from "../Auth/checkComponent/CheckUserComponent";
import { getCartItemKey, resolveStoredColorId } from "../../utils/cartUtils";

export default function Viewcart() {
  const isLoggedIn = checkUser();
  const cartData = useSelector((state) => state.CartData?.data);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [updateq, setUpdateQ] = useState({});
  const navigate = useNavigate();

  const fetchCartData = useCallback(async () => {
    if (!checkUser()) {
      setLoading(false);
      return;
    }

    try {
      await dispatch(getCart());
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const removeCartProduct = useCallback(
    async (productId, colorId, quantity) => {
      try {
        await dispatch(removeFromCart({ productId, colorId, quantity }));
        fetchCartData(); // Fetch updated cart data
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    },
    [dispatch, fetchCartData]
  );

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  useEffect(() => {
    if (cartData?.cartItems) {
      const initialQuantities = {};
      cartData.cartItems.forEach((item, index) => {
        if (item.product) {
          initialQuantities[getCartItemKey(item, index)] = item.quantity;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [cartData]);

  const handleIncrease = (itemKey) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemKey]: (prevQuantities[itemKey] || 1) + 1,
    }));
    setUpdateQ((prevUpdateQ) => ({
      ...prevUpdateQ,
      [itemKey]: true,
    }));
  };

  const handleDecrease = (itemKey) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemKey]: prevQuantities[itemKey] > 1 ? prevQuantities[itemKey] - 1 : 1,
    }));
    setUpdateQ((prevUpdateQ) => ({
      ...prevUpdateQ,
      [itemKey]: true,
    }));
  };

  const handleUpdateCart = (productId, colorId, itemKey) => {
    const quantity = quantities[itemKey];
    dispatch(
      setCartQuantity({
        productId,
        colorId: resolveStoredColorId(productId, colorId),
        quantity,
      })
    )
      .then(() => fetchCartData())
      .then(() => {
        setUpdateQ((prevUpdateQ) => ({
          ...prevUpdateQ,
          [itemKey]: false,
        }));
      });
  };

  const handleQuantityChange = (itemKey, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemKey]: Number(value),
    }));
    setUpdateQ((prevUpdateQ) => ({
      ...prevUpdateQ,
      [itemKey]: true,
    }));
  };

  const handleContinue = async () => {
    await dispatch(CartToOrderSummary()).then(() => {
      navigate("/cart/ordersummary");
    });
  };

  const handleNavigate = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="loader"></div>
      ) : isLoggedIn ? (
        <section className="containerCart">
          <div className="cards">
            {cartData?.cartItems && cartData.cartItems.length > 0 ? (
              cartData.cartItems.map(
                (item, index) =>
                  item.product && (
                    <section
                      key={getCartItemKey(item, index)}
                      className="cartcard-container"
                    >
                      <div className="cartcard">
                        <div className="cartcartImgContainer">
                          <img
                            src={item.product.productImage}
                            alt={item.product.product_name}
                          />
                        </div>
                        <div className="cartcard-textPart">
                          <div>
                            <h5 style={{ lineHeight: 2 }}>
                              {item.product.product_name}
                            </h5>
                            <p>
                              delivery in 5pm |{" "}
                              <span className="text-success">FREE</span>
                            </p>
                            <p className="text-muted text-capitalize m-0">
                              {item.product.category}
                            </p>
                          </div>
                          <div className="cartcardPrice-sec">
                            <p>₹{item.product.mrp_price}</p>
                            <p>₹{item.product.selling_price}</p>
                            <p>
                              {(
                                ((item.product.mrp_price -
                                  item.product.selling_price) /
                                  item.product.mrp_price) *
                                100
                              ).toFixed(0)}
                              % off
                            </p>
                          </div>
                          <div className="cartcard-buttons">
                            <div className="quantity-buttons">
                              <CiCircleMinus
                                size={35}
                                onClick={() =>
                                  handleDecrease(getCartItemKey(item, index))
                                }
                              />
                              <input
                                type="number"
                                value={
                                  quantities[getCartItemKey(item, index)] ||
                                  item.quantity
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    getCartItemKey(item, index),
                                    e.target.value
                                  )
                                }
                                min="1"
                                style={{
                                  width: "3rem",
                                  padding: "3px 4px",
                                  textAlign: "center",
                                }}
                              />
                              <CiCirclePlus
                                size={35}
                                onClick={() =>
                                  handleIncrease(getCartItemKey(item, index))
                                }
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeCartProduct(
                                  item.product._id,
                                  item.colorOptionId,
                                  item.quantity
                                )
                              }
                            >
                              Remove
                            </button>
                            {updateq[getCartItemKey(item, index)] && (
                              <button
                                type="button"
                                className="card-button"
                                onClick={() =>
                                  handleUpdateCart(
                                    item.product._id,
                                    item.colorOptionId,
                                    getCartItemKey(item, index)
                                  )
                                }
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  )
              )
            ) : (
              <div
                className="cards mx-auto"
                style={{
                  width: "50%",
                  textAlign: "center",
                  marginTop: "3rem",
                  fontSize: "1rem",
                }}
              >
                <p
                  style={{ fontWeight: 500, fontSize: "140%" }}
                  className="--bs-warning"
                >
                  No Products in Cart
                </p>
                <Link
                  className="text-center badge text-bg-warning fs-3 mt-4"
                  to={"/"}
                >
                  shop now
                </Link>
              </div>
            )}
            {cartData?.cartItems && cartData.cartItems.length > 0 && (
              <div className="placeorder">
                <button onClick={handleContinue}>Place order</button>
              </div>
            )}
          </div>
          {cartData?.cartItems && cartData.cartItems.length > 0 && (
            <div className="col-md-4">
              <div className="price-details">
                <h5 className="product-title border-bottom py-2">
                  Price Details
                </h5>
                <div className="py-1">
                  Price ({cartData?.totalQuantity || 0} items):{" "}
                  <span className="float-end">
                    ₹{formatNumberWithCommas(cartData?.totalPrice) || 0}
                  </span>
                </div>
                <div className="py-1">
                  Discount:{" "}
                  <span className="text-success float-end">
                    ₹{cartData?.totalDiscountedPrice || 0}
                  </span>
                </div>
                <div className="py-1">
                  Delivery Charges:{" "}
                  <span className="text-success float-end">Free</span>
                </div>
                <h5 className="py-2 border-top">
                  Total Amount:{" "}
                  <span className="float-end">
                    ₹{cartData.totalPayablePrice &&formatNumberWithCommas(cartData?.totalPayablePrice)}
                  </span>
                </h5>
              </div>
            </div>
          )}
        </section>
      ) : (
        <CheckUserComponent handleNavigate={handleNavigate} >
               <div className='mt-4 d-flex flex-column  justify-center' style={{color:'black'}}>
                <p  className='text-center' style={{fontWeight:500}}>Missing Cart items?</p>
                <p className='text-center' style={{fontWeight:300}}>Login to see the items you added previously</p>
                <button className='btn  px-4' onClick={handleNavigate}> login</button>
              </div>
          </CheckUserComponent>
      )}
    </>
  );
}
