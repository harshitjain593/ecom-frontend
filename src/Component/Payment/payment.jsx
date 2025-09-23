import React, { useCallback, useEffect, useRef, useState } from "react";
import css from "../OrderSummary/ordersummary.module.css";
import { checkUser, formatNumberWithCommas } from "../../assest/js/checker";
import { useDispatch, useSelector } from "react-redux";
import ChangeUser from "../OrderSummary/ChangeUser";
import { getProductDetails } from "../../action/productdetailaction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import ChangeAddress from "../OrderSummary/ChangeAddress";
import { createOrder } from "../../action/createOrderAction";
import { verifyPayment } from "../../action/paymentVerifyAction";
import CryptoJS from "crypto-js";
import { getOrderSummary } from "../../action/orderSummaryAction";
import { MdVerifiedUser } from "react-icons/md";
import { GET_DIRECTBUY } from "../../action/actionType";

function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.getUser?.user);
  const user = checkUser();
  const [selectedAddress, setSelectedAddress] = useState({});
  const [modal, setModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [updating, setUpdating] = useState(false);
  const orderDetails = useSelector((state) => state.OrderSummary?.data);
  const directBuy = useSelector(state=> state.directBuy?.data)
  const directAddress = useSelector(state=> state.directBuy?.shipping_address)
  const [reqProducts, setReqProducts] = useState({});
  const orderedList = useSelector((state) => state.orderDetails.data);
  const [orderCreated, setOrderCreated] = useState(false);
  const paymentId = useRef(null);
  const paymentMethod = useRef(null);
  const [direct, setDirect] = useState(false);
  const [timeOutId, setTimeoutId] = useState("");

  useEffect(() => {
    if(checkUser()){

      dispatch(getOrderSummary());
    }else{

      dispatch({
       type:GET_DIRECTBUY
      })
    }
  }, [dispatch]);

  useEffect(() => {
   
    if (userDetails ) {
      setSelectedAddress(prev=>userDetails.shipping_address[0]);
    }else{
      directAddress&& setSelectedAddress(prev=>directAddress[0])
    }
  }, [userDetails,directAddress]);

  const handleAddress = useCallback(() => {
    setAddressModal(true);
  }, [selectedAddress]);

  const generateCaptcha = () => {
    // Generate a 4-digit CAPTCHA more reliably
    const randomCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(randomCaptcha);
    setInput(""); // Reset input field
    setCaptchaError(false); // Reset error state
    console.log('Generated CAPTCHA:', randomCaptcha);
  };
  
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    console.log('Input change:', value);
    setInput(value);
    // Only clear error when user starts typing, don't validate in real-time
    if (captchaError && value.length > 0) {
      setCaptchaError(false);
    }
  }, [captchaError]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleDirect = useCallback(() => {
    setDirect(true)
    clearTimeout(timeOutId);
    const id = setTimeout(() => {
      navigate("/");
    }, 1500);
    setTimeoutId(id);
  }, []);

  useEffect(() => {
    return clearTimeout(timeOutId);
  }, []);

  const handleReqBody = useCallback(() => {
    let products = [];
    if(checkUser()){
        orderDetails.orderItems.forEach((product) => {
          let obj = {};
          obj.quantity = product.quantity;
          obj.product = product.product._id; // Fixed key
          obj.total_price = product.mrp_price; // Fixed key
          obj.payable_price = product.selling_price; // Fixed key
          obj.discount = product.discounting_price; // Fixed key
          obj.colorOptionId= product.colorOptionId;
          products.push(obj);
        });
        return {
          products,
          shippingAddress: selectedAddress,
          billingAddress: selectedAddress,
          shippingMethod: "Standard Shipping",
        };
    }else{
      directBuy.orderItems.forEach((product) => {
        let obj = {};
        obj.quantity = product.quantity;
        obj.product = product.product._id; // Fixed key
        obj.total_price = product.mrp_price; // Fixed key
        obj.payable_price = product.selling_price; // Fixed key
        obj.discount =product.discounted_price; // Fixed key
        obj.colorOptionId = product.colorOptionId
        products.push(obj);
      });
      return {
        products,
        shippingAddress: selectedAddress,
        billingAddress: selectedAddress,
        shippingMethod: "Standard Shipping",
      };
    }
  }, [orderDetails, selectedAddress]);

  const handlePaymentSuccess = useCallback(
    async (message, response) => {
      console.log(response,'-respo,,,' ,'messgage :', message,'')
      if (message === "succeeded") {
        const newResponse = {
          ...response,
           paymentMethod: paymentMethod.current ,
        };
        console.log(
          "Payment success response:",
          message,
          "response: ",
          newResponse
        );
        await dispatch(verifyPayment(newResponse)).then(() => {
          setDirect(true);
          handleDirect();
        });
        localStorage.removeItem('directBuy')
        localStorage.removeItem('directAddress')
      } else {
        alert("payment Failed please try again");
        console.log("resp on failed", response);
        await dispatch(verifyPayment(response)).then(() => {
          
        });
      }
    },
    [dispatch]
  );

  const handleRazorConfig = useCallback(() => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_ID_KEY, // Replace with your Razorpay key ID
      amount: parseInt(orderedList.amount),
      currency: orderedList.currency,
      name: "Oluxe",
      description: "Test Transaction",
      image:'https://harshitj593.s3.eu-north-1.amazonaws.com/colored-logo+(1).png',
      order_id: orderedList.id,
      handler: (response) => {
        console.log("succeeded");
        console.log(response);
        paymentId.current = response.razorpay_payment_id;
        const signature = CryptoJS.HmacSHA256(
          `${orderedList.id}|${response.razorpay_payment_id}`,
          process.env.REACT_APP_RAZORPAY_SECRET_KEY
        ).toString(CryptoJS.enc.Hex);

        // Verify if the generated hash matches the Razorpay signature
        const succeeded = signature === response.razorpay_signature;

        if (succeeded) {
          handlePaymentSuccess("succeeded", {
            razorpay_order_id: orderedList.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        } else {
          handlePaymentSuccess("failed", {
            razorpay_order_id: orderedList.id,
            razorpay_payment_id: response.razorpay_payment_id,
          });
        }
      },
      modal: {
        confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
        // This function is executed when checkout modal is closed
        // There can be 3 reasons when this modal is closed.
        ondismiss: async (reason) => {
          const {
            reason: paymentReason,
            field,
            step,
            code,
          } = reason && reason.error ? reason.error : {};
          // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly.
          if (reason === undefined) {
            console.log("cancelled");
            handlePaymentSuccess("Cancelled");
          }
          // Reason 2 - When modal is auto closed because of time out
          else if (reason === "timeout") {
            console.log("timedout");
            handlePaymentSuccess("timedout");
          }
          // Reason 3 - When payment gets failed.
          else {
            console.log("failed");
            handlePaymentSuccess("failed", {
              razorpay_order_id: orderedList.id,
            });
          }
        },
      },
      // This property allows to enble/disable retries.
      // This is enabled true by default.
      retry: {
        enabled: false,
      },
      timeout: 900, // Time limit in Seconds
      theme: {
        color: "#f1c40f", // Custom color for your checkout modal.
      },
    };

    const rzp1 = new window.Razorpay(options);

    // If you want to retreive the chosen payment method.
    rzp1.on("payment.submit", (response) => {
      console.log("success from raz", response);
      paymentMethod.current = response.method;
    });

    // To get payment id in case of failed transaction.
    rzp1.on("payment.failed", (response) => {
      console.log("failed and calleback", response);
      paymentId.current = response.error.metadata.payment_id;
    });

    // to open razorpay checkout modal.
    rzp1.open();
  }, [
    orderedList,
    dispatch,
    selectedMethod,
    userDetails,
    selectedAddress,
    handlePaymentSuccess,
  ]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log('Form submitted, current input state:', input);
      if (selectedMethod === "cod") {
        // Check if user is logged in
        if (!checkUser()) {
          alert("Please login to place a cash on delivery order");
          return;
        }
        
        // Trim whitespace and make comparison case-insensitive for better UX
        const trimmedInput = input.trim();
        const trimmedCaptcha = captcha.trim();
        console.log('CAPTCHA Debug:', { 
          originalInput: input, 
          originalCaptcha: captcha, 
          trimmedInput, 
          trimmedCaptcha,
          match: trimmedCaptcha.toLowerCase() === trimmedInput.toLowerCase()
        });
        if (trimmedCaptcha.toLowerCase() !== trimmedInput.toLowerCase()) {
          setCaptchaError(true);
          return;
        } else {
          setCaptchaError(false);
          const updatedReqProducts = handleReqBody();
          setReqProducts(updatedReqProducts);
          await dispatch(
            createOrder({
              ...updatedReqProducts,
              paymentMethod: "Cash on delivery",
            })
          ).then(() => {
            // Skip OTP verification for logged-in users and directly place order
            setDirect(true);
            handleDirect();
          });
          return;
        }
      }
      if (selectedMethod !== "cod") {
        const updatedReqProducts = handleReqBody();
        setReqProducts(updatedReqProducts);

        await dispatch(createOrder(updatedReqProducts)).then(async () => {
          setOrderCreated(true);
        });
      }
    },
    [dispatch, handleReqBody, selectedMethod, handleDirect, input, captcha]
  );

  useEffect(() => {
    if (orderCreated && selectedMethod !== "cod") {
      handleRazorConfig();
      setOrderCreated(false);
    }
  }, [orderCreated, handleRazorConfig,dispatch, input]);

  if (direct) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center mx-auto "
        style={{ margin: "10% 0", fontSize: "1.3rem", fontWeight: 600 }}
      >
        <div>
          Thank you for choosing Oluxe, your order has been placed{" "}
          <MdVerifiedUser color="green" size={30} />
        </div>
        <p style={{ fontSize: ".7rem" }}>you will be redirected shortly</p>
      </div>
    );
  }

  // OTP verification removed for logged-in users - orders are placed directly

  if(!checkUser()){
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
                <span className="flex-nowrap">
                  {userDetails && userDetails.name}
                </span>
                {userDetails && userDetails.mobile}
              </p>
            </div>
          </main>
          <div className={css.buttonContent}>
            <Link to={'/login'} >Login</Link>
          </div>
        </div>
        {selectedAddress ? (
          <div className={css.box}>
            <main>
              <div>
                <p className="text-primary">2</p>
              </div>
              <div className={`${css.addresscontent}`}>
                <h5 className="">DELIVERY ADDRESS</h5>
                <p className={css.address}>
                  <span>{selectedAddress.fullName}</span> -
                  <span>{selectedAddress.mobile}</span> ,
                  {selectedAddress.billing_address}{" "}
                  <span>pinCode:{selectedAddress.pinCode}</span>
                </p>
              </div>
            </main>
            <div className={css.buttonContent}>
              <Link to={'/cart/ordersummary'}>change</Link>
            </div>
          </div>
        ) : null}
        <div className={css.paymentSummary}>
          <div className="">
            <p>3</p>
            <p>Order summary</p>
          </div>
          <div className={`d-flex justify-content-between px-4 mt-2 `}>
            <p style={{ fontWeight: "600" }}>
              Items ({directBuy && directBuy.totalQuantity})
            </p>
            <Link to={"/cart/ordersummary"} className={css.linkbutton}>
              CHANGE
            </Link>
          </div>
        </div>

        <div className={css.paymentbox}>
          <div style={{ background: "#EDB70B" }}>
            <p>4</p>
            <p className="text-white">PAYMENT OPTION</p>
          </div>
          <div className="p-3">
            <form onSubmit={handleSubmit}>
              <div className="form-check py-2 d-flex flex-column">
                <div>
                  <input
                    type="radio"
                    checked={selectedMethod==='upi'}
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    onChange={handleMethodChange}
                    className="form-check-input"
                  />
                  <label htmlFor="upi" className="form-check-label">
                    <img
                      src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif"
                      alt="UPI"
                      height="20"
                    />{" "}
                    UPI / Cards / Net-Banking / Wallets
                    <br />
                    <small>Pay by any UPI app</small>
                  </label>
                </div>
              </div>
{/* 
              <div className="form-check py-2">
                <input
                  type="radio"
                  id="wallets"
                  checked={selectedMethod==='wallets'}
                  name="paymentMethod"
                  value="wallets"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="wallets" className="form-check-label">
                  <img
                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif"
                    alt="Wallets"
                    height="20"
                  />{" "}
                  Wallets
                </label>
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod==='card'}
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="card" className="form-check-label">
                  Credit / Debit / ATM Card
                  <br />
                  <small>Add and secure cards as per RBI guidelines</small>
                </label>
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="net-banking"
                  name="paymentMethod"
                  value="net-banking"
                  checked={selectedMethod==='net-banking'}
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="net-banking" className="form-check-label">
                  Net Banking
                  <br />
                  <small>
                    This instrument has low success, use UPI or cards for better
                    experience
                  </small>
                </label>
              </div> */}

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="cod"
                  checked={selectedMethod==='cod'}
                  name="paymentMethod"
                  value="cod"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="cod" className="form-check-label">
                  <div>
                    Cash on Delivery
                    <div className="mt-2">
                      <small className="text-warning border border-danger px-3 py-1">
                        Due to handling costs, a nominal fee of ₹10 will be
                        charged
                      </small>
                      <div className="d-flex align-items-center mt-3">
                        <div className="input-group">
                          <span
                            className="input-group-text text-success"
                            id="captcha-image"
                          >
                            {captcha}
                            <i
                              className="fa-solid fa-arrows-rotate text-info px-2"
                              onClick={generateCaptcha}
                            ></i>
                          </span>
                          <input
                            type="text"
                            className="form-control px-2 py-2"
                            id="captcha"
                            value={input}
                            style={{ height: "38px" }}
                            onChange={handleInputChange}
                            placeholder="Enter CAPTCHA"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                {captchaError ? (
                  <label className="text-danger d-block">wrong captcha </label>
                ) : (
                  ""
                )}
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="emi"
                  name="paymentMethod"
                  value="emi"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="emi" className="form-check-label">
                  EMI (Easy Installments)
                  <br />
                  <small>Not applicable</small>
                </label>
              </div>

              {selectedMethod && selectedMethod !== "emi" && (
                <button className="btn btn-warning" type="submit">
                  Continue
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
      <section className={css.priceDetails}>
        <div>
          <h4>price details</h4>
        </div>
        <main>
          <div className={css.priceTop}>
            <p>
              <span>
                {" "}
                price (item:{directBuy && directBuy.totalQuantity}){" "}
              </span>{" "}
              <span>₹{directBuy && directBuy.totalPayablePrice}</span>
            </p>
            <p>
              <span>delivery charges</span>
              <span className="text-success">free</span>
            </p>
          </div>
          <div className={css.total}>
            <p>total payable</p>
            <p>
              ₹
              {directBuy.totalPayablePrice &&
                formatNumberWithCommas(directBuy.totalPayablePrice)}
            </p>
          </div>
        </main>
      </section>
    </section>
  );
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
                <span className="flex-nowrap">
                  {userDetails && userDetails.name}
                </span>
                {userDetails && userDetails.mobile}
              </p>
            </div>
          </main>
          <div className={css.buttonContent}>
            <button onClick={() => setModal(true)}>change</button>
          </div>
        </div>
        {selectedAddress ? (
          <div className={css.box}>
            <main>
              <div>
                <p className="text-primary">2</p>
              </div>
              <div className={`${css.addresscontent}`}>
                <h5 className="">DELIVERY ADDRESS</h5>
                <p className={css.address}>
                  <span>{selectedAddress.fullName}</span> -
                  <span>{selectedAddress.mobile}</span> ,
                  {selectedAddress.billing_address}{" "}
                  <span>pinCode:{selectedAddress.pinCode}</span>
                </p>
              </div>
            </main>
            <div className={css.buttonContent}>
              <button onClick={handleAddress}>change</button>
            </div>
          </div>
        ) : null}
        <div className={css.paymentSummary}>
          <div className="">
            <p>3</p>
            <p>Order summary</p>
          </div>
          <div className={`d-flex justify-content-between px-4 mt-2 `}>
            <p style={{ fontWeight: "600" }}>
              Items ({orderDetails && orderDetails.totalQuantity})
            </p>
            <Link to={"/cart/ordersummary"} className={css.linkbutton}>
              CHANGE
            </Link>
          </div>
        </div>

        <div className={css.paymentbox}>
          <div style={{ background: "#EDB70B" }}>
            <p>4</p>
            <p className="text-white">PAYMENT OPTION</p>
          </div>
          <div className="p-3">
            <form onSubmit={handleSubmit}>
              <div className="form-check py-2 d-flex flex-column">
                <div>
                  <input
                    type="radio"
                    checked={selectedMethod==='upi'}
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    onChange={handleMethodChange}
                    className="form-check-input"
                  />
                  <label htmlFor="upi" className="form-check-label">
                    <img
                      src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif"
                      alt="UPI"
                      height="20"
                    />{" "}
                    UPI / Cards / Net-Banking / Wallets
                    <br />
                    <small>Pay by any UPI app</small>
                  </label>
                </div>
              </div>
{/* 
              <div className="form-check py-2">
                <input
                  type="radio"
                  id="wallets"
                  checked={selectedMethod==='wallets'}
                  name="paymentMethod"
                  value="wallets"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="wallets" className="form-check-label">
                  <img
                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif"
                    alt="Wallets"
                    height="20"
                  />{" "}
                  Wallets
                </label>
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod==='card'}
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="card" className="form-check-label">
                  Credit / Debit / ATM Card
                  <br />
                  <small>Add and secure cards as per RBI guidelines</small>
                </label>
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="net-banking"
                  name="paymentMethod"
                  value="net-banking"
                  checked={selectedMethod==='net-banking'}
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="net-banking" className="form-check-label">
                  Net Banking
                  <br />
                  <small>
                    This instrument has low success, use UPI or cards for better
                    experience
                  </small>
                </label>
              </div> */}

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="cod"
                  checked={selectedMethod==='cod'}
                  name="paymentMethod"
                  value="cod"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="cod" className="form-check-label">
                  <div>
                    Cash on Delivery
                    <div className="mt-2">
                      <small className="text-warning border border-danger px-3 py-1">
                        Due to handling costs, a nominal fee of ₹10 will be
                        charged
                      </small>
                      <div className="d-flex align-items-center mt-3">
                        <div className="input-group">
                          <span
                            className="input-group-text text-success"
                            id="captcha-image"
                          >
                            {captcha}
                            <i
                              className="fa-solid fa-arrows-rotate text-info px-2"
                              onClick={generateCaptcha}
                            ></i>
                          </span>
                          <input
                            type="text"
                            className="form-control px-2 py-2"
                            id="captcha"
                            value={input}
                            style={{ height: "38px" }}
                            onChange={handleInputChange}
                            placeholder="Enter CAPTCHA"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                {captchaError ? (
                  <label className="text-danger d-block">wrong captcha </label>
                ) : (
                  ""
                )}
              </div>

              <div className="form-check py-2">
                <input
                  type="radio"
                  id="emi"
                  name="paymentMethod"
                  value="emi"
                  onChange={handleMethodChange}
                  className="form-check-input"
                />
                <label htmlFor="emi" className="form-check-label">
                  EMI (Easy Installments)
                  <br />
                  <small>Not applicable</small>
                </label>
              </div>

              {selectedMethod && selectedMethod !== "emi" && (
                <button className="btn btn-warning" type="submit">
                  Continue
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
      <section className={css.priceDetails}>
        <div>
          <h4>price details</h4>
        </div>
        <main>
          <div className={css.priceTop}>
            <p>
              <span>
                {" "}
                price (item:{orderDetails && orderDetails.totalQuantity}){" "}
              </span>{" "}
              <span>₹{orderDetails && orderDetails.totalPayablePrice}</span>
            </p>
            <p>
              <span>delivery charges</span>
              <span className="text-success">free</span>
            </p>
          </div>
          <div className={css.total}>
            <p>total payable</p>
            <p>
              ₹
              {orderDetails.totalPayablePrice &&
                formatNumberWithCommas(orderDetails.totalPayablePrice)}
            </p>
          </div>
        </main>
      </section>
      {userDetails ? (
        <>
          {modal ? <ChangeUser user={userDetails} setModal={setModal} /> : null}
          {addressModal ? (
            <ChangeAddress
              userDetails={userDetails}
              setModal={setAddressModal}
              currentAdress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
export default Payment;
