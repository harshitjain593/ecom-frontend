import React, { useState } from 'react';
import styles from './OrderTracking.module.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trackingApi } from '../../action/tracking';

const OrderTracking = () => {
  const [trackingOption, setTrackingOption] = useState('orderId'); // Set default to 'orderId'
  const [orderId, setOrderId] = useState('');
  const [waybillNumber, setWaybillNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch()

  // Handler for changing tracking option
  const handleOptionChange = (e) => {
    setTrackingOption(e.target.value);
    setErrorMessage(''); // Clear error message on option change
  };

  // Handle form submission
  const handleCheckClick = () => {
    if (trackingOption === 'orderId' && !orderId) {
      setErrorMessage('Please enter an Order ID.');
    } else if (trackingOption === 'waybill' && !waybillNumber) {
      setErrorMessage('Please enter a Waybill Number.');
    } else {
      setErrorMessage('');
        dispatch(trackingApi(trackingOption === 'waybill'? {trackingNumber:waybillNumber} : {orderId:orderId}))
      console.log('Checking:', trackingOption === 'orderId' ? orderId : waybillNumber);
    }
  };

  return (
    <div className={styles.container}>
      <article className={`${styles.card} px-2`}>
        <header className={`${styles.cardHeader} mb-3 fs-6`}>Orders / Tracking</header>
        
        {/* Radio buttons for selecting Order ID or Waybill Number */}
        <section className='d-flex flex-column justify-content-center align-items-center my-4 mx-4' style={{ width: 'max-content' }}>
          <label htmlFor="" style={{ fontWeight: 600 }}>Track By:</label>
          <div className="d-flex gap-4 ">
            <div className='d-flex align-items-center justify-flex-center gap-2'>
                <input 
                  type="radio" 
                  name="trackingOption" 
                  value="orderId" 
                  checked={trackingOption === 'orderId'} 
                  onChange={handleOptionChange} 
                /> 
              <label className="">order ID   </label>
            </div>
            <div className='d-flex align-items-center justify-flex-center gap-2 '>

                <input 
                  type="radio" 
                  name="trackingOption" 
                  value="waybill" 
                  checked={trackingOption === 'waybill'} 
                  onChange={handleOptionChange} 
                  /> 
                  <label>WayBill Number</label>
            </div>
          </div>
        </section>

        {/* Conditionally render input field based on selected tracking option */}
        <section className='d-flex flex-column justify-content-start align-items-start mx-4' style={{ width: 'max-content' }}>
          {trackingOption === 'orderId' ? (
            <>
              <label htmlFor="orderId" style={{ fontWeight: 600 }}>Order ID</label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </>
          ) : (
            <>
              <label htmlFor="waybill" style={{ fontWeight: 600 }}>Waybill Number</label>
              <input
                type="text"
                id="waybill"
                value={waybillNumber}
                onChange={(e) => setWaybillNumber(e.target.value)}
              />
            </>
          )}
        </section>

        {/* Check button */}
        <section className='d-flex justify-content-start align-items-start mb-4 mx-4'>
          <button className="btn btn-primary" onClick={handleCheckClick}>
            Check
          </button>
        </section>

        {/* Display error message if required */}
        {errorMessage && (
          <section className='d-flex justify-content-start align-items-start my-2 mx-4'>
            <p className="text-danger">{errorMessage}</p>
          </section>
        )}

        <div className={styles.cardBody}>
          <h6>Order ID: {orderId || 'OD45345345435'}</h6>
          <article className={styles.card}>
            <div className={`${styles.cardBody} row`}>
              <div className="col trackhead">
                <strong>Estimated Delivery time:</strong> <br />29 Nov 2019
              </div>
              <div className="col trackhead">
                <strong>Shipping BY:</strong> <br />BLUEDART, | <i className="fa fa-phone"></i> +1598675986
              </div>
              <div className="col trackhead">
                <strong>Status:</strong> <br />Picked by the courier
              </div>
              <div className="col trackhead">
                <strong>Tracking #:</strong> <br />BD045903594059
              </div>
            </div>
          </article>
          
          <div className={`${styles.track}`}>
            <div className={`${styles.step} ${styles.active}`}>
              <span className={styles.icon}>
                <i className="fa fa-check"></i>
              </span>
              <span className={styles.text}>Order confirmed</span>
            </div>
            <div className={`${styles.step} ${styles.active}`}>
              <span className={styles.icon}>
                <i className="fa fa-user"></i>
              </span>
              <span className={styles.text}>Picked by courier</span>
            </div>
            <div className={`${styles.step} ${styles.active}`}>
              <span className={styles.icon}>
                <i className="fa fa-truck"></i>
              </span>
              <span className={styles.text}>On the way</span>
            </div>
            <div className={styles.step}>
              <span className={styles.icon}>
                <i className="fa fa-box"></i>
              </span>
              <span className={styles.text}>Ready for pickup</span>
            </div>
          </div>
          <hr />

          <Link to="/user/orders" className="btn btn-warning" data-abc="true">
            <i className="fa fa-chevron-left"></i> Back to orders
          </Link>
        </div>
      </article>
    </div>
  );
};

export default OrderTracking;
