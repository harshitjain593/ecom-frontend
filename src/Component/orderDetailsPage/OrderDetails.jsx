import React, { useEffect, useState } from "react";
import './orderDetails.css';
import { FaStar } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getsingleOrderDetails } from "../../action/myorderActions";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(state => state.singleOrder?.data);
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState(null);
 
  useEffect(() => {
    const IdArray = id.split('+');
    setProductId(IdArray[1]);
    dispatch(getsingleOrderDetails(IdArray[0]));
  }, [dispatch, id]);

  useEffect(() => {
    if (productId && order?.length > 0) {
      const filteredOrder = order.find(item => item.product[0].product._id === productId);
      setProduct(filteredOrder);
    }
  }, [productId, order]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const filteredTrackingInfo = product.trackingInfo.length > 1
    ? product.trackingInfo.filter((track, index) => !(index === 0 && track.status === 'Pending'))
    : product.trackingInfo;
  console.log(product)
  // return(
  //   <div> {product.}</div>
  // )
  return (
    <section className="od-main">
      <div className="od-topBox d-flex justify-content-between align-items-start px-md-4 py-md-4 py-2 px-1 flex-column flex-md-row">
        <section className="od-addressbox col-md-6 px-md-4 px-2">
          <h5 className="mb-2">Delivery Address</h5>
          <div className="d-flex flex-column">
            <label style={{ fontWeight: 500 }}>{product.billingAddress[0]?.fullName}</label>
            <p>{product.billingAddress[0]?.billing_address}</p>
            <div className="mt-2">
              <label>Phone Number</label>
              <p>{product.billingAddress[0]?.mobile}</p>
            </div>
          </div>
        </section>
        <section className="col-md-6 md-px-0 px-2 mt-md-0 mt-2">
          <div className="d-flex flex-column align-item-center">
            <h5 className="mb-2 text-capitalize">More Actions</h5>
          </div>
        </section>
      </div>
      <main className="my-2 od-productbox px-md-4 py-md-4 py-2">
        <section className="px-3 od-productsecbox">
          <div className="d-flex justify-content- col-md-4 gap-3">
            <div className="od-product-imgcontainer">
              <img src={product.product[0].product.productImage} alt="Product" />
            </div>
            <div className="od-product-textbox d-flex flex-column justify-content-start gap-2 align-items-start">
              <h6>{product.product[0].product.product_name}</h6>
              <p>{product.product[0].product.category}</p>
              <div>
                <label>₹{product.product[0].product.selling_price}</label>
              </div>
            </div>
          </div>

          <div className="container" style={{ margin: 0, padding: 0 }}>
            <div className="row">
              <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                <div className="row justify-content-between">
                  {filteredTrackingInfo.map((track) => (
                    <div key={track._id} className={`order-tracking ${track.status === 'Delivered' ? 'completed' : ''}`}>
                      <span className={`is-complete ${track.status === 'Delivered' ? 'complete' : ''}`}></span>
                      <p>{track.status}<br /><span>{new Date(track.date).toLocaleDateString()}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="d-flex justify-content-center align-items-center mt-2" style={{ borderTop: '1px solid lightgray' }}>
          <Link to={`/product/review/${productId}`} className="text-center pt-1 ratinglink d-flex justify-content-center align-items-center gap-2" style={{ fontWeight: 500, fontSize: '.9rem' }}>
            <FaStar color="white" /> Rate & Review Product
          </Link>
        </div>
        <div className="px-3 od-returnpolicy">
          <p style={{ margin: 0, fontWeight: 400, textTransform: "capitalize", fontSize: '.8rem' }}>Product Return Policy:</p>
          <ul>
            {product.product&& product.product[0].product?.return_policy.map((item,i)=>(
              <li key={i}>{item}</li>
            ))}
            
          </ul>
        </div>
      </main>
    </section>
  );
};

export default OrderDetails;
