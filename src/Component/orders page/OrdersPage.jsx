import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myOrderAction } from '../../action/myorderActions';
import './orderss.css';
import { Link } from 'react-router-dom';
import { dateConverter } from '../../assest/js/dateConverter';
const orderStatus = {
  'Pending': 'gray',
  'Order confirmed': 'green',
  'Shipped': 'green',
  'Out for Delivery': 'yellow',
  'Delivered': 'green',
  'Cancelled': 'red'
};

const OrderPage = () => {
  const dispatch = useDispatch();
  const myOrders = useSelector(state => state.myOrder?.data?.orders);
  const loading = useSelector(state => state.myOrder?.loading);
  const error = useSelector(state => state.myOrder?.error);

  useEffect(() => {
    dispatch(myOrderAction());
  }, [dispatch]);



  

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {myOrders && myOrders.length > 0 ? (
        myOrders.map((order,index) => (
          <div key={index} className="order-card card mb-3">
            {order.product.map((item, index) => (
              <div key={item.product._id} className="card-body">
                <div className="row justify-content-between">
                  <div className="col-md-2">
                  {item.product.productImage && <img src={ item.product.productImage} className="img-fluid" alt="Product" />}
                  </div>
                  <div className="col-md-8">
                    <h5 className="card-title">{item.product.product_name}</h5>
                    <p className="card-text">Order Number: {order.orderNumber}</p>
                    <p className="card-text">Order Date: {dateConverter(order.createdAt)}</p>
                    <p className="card-text d-flex align-items-center gap-2">
                      Status: 
                      <span 
                        className={`badge ${orderStatus[order.trackingInfo[order.trackingInfo.length - 1].status] }`} 
                        // style={{ backgroundColor: orderStatus[order.trackingInfo[order.trackingInfo.length - 1].status] }}
                      >
                      </span>
                        {order.trackingInfo[order.trackingInfo.length - 1].status}
                    </p>
                    <Link to={`/user/orders/${order.orderId}+${item.product._id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
         
          
        ))
      ) : (
        !loading && <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderPage;
