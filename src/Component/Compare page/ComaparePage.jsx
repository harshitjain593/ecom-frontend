import React, { useCallback, useEffect, useState } from "react";
import './compare.css';
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CgCloseR } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_COMPARE_PRODUCTS } from "../../action/actionType";
import { addtoCart } from "../../action/productdetailaction";
import { addSingleToOrderSummary } from "../../action/orderSummaryAction";
import { checkUser } from "../../assest/js/checker";

const SkeletonBox = ({category}) => {
  console.log('skel',category)
  return (
  <section className="skeleton-box">
    <Link to={`/category/${category}`}>
    <div className="skeleton-img text-center "> 
      <p style={{fontWeight:500,fontSize:'140%', textTransform:"capitalize", color:'gray'}}>Add product </p>
    </div>
    </Link>
    <div className="skeleton-text mt-1"></div>
    <div className="skeleton-text-bg mt-2"></div>
  </section>
)};

// Skeleton component for ratings and reviews
const SkeletonRatingAndReview = () => (
  <section className=" skeleton-box">
    <div className="skeleton-rating"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text-bg mt-1"></div>
  </section>
);

// Skeleton component for highlights
const SkeletonHighlights = () => (
  <section className=" skeleton-box">
    <ul className="skeleton-list d-flex flex-column gap-3">
      <li className="skeleton-text-bg"></li>
      <li className="skeleton-text-bg"></li>
      <li className="skeleton-text-bg"></li>
    </ul>
  </section>
);

// Skeleton component for delivery information
const SkeletonDelivery = () => (
  <section className=" skeleton-box">
    <div className="skeleton-text-bg"></div>
  </section>
);

// Skeleton component for specifications
const SkeletonSpecifications = () => (
  
  <section className=" skeleton-box d-flex flex-column gap-2">
    <div className="mb-5"></div>
    <div className="skeleton-text-bg"></div>
    <div className="skeleton-text-bg"></div>
    <div className="skeleton-text-bg"></div>
    <div className="skeleton-text-bg"></div>
  </section>
);

// Skeleton component for the last box
const SkeletonLastBox = () => (
  <section className="skeleton-box">
    <Link to={'/'}>
      <div className="skeleton-img"></div>
    </Link>
    <div className="skeleton-text-bg mt-2"></div>
    <div className="skeleton-text-bg mt-2"></div>
    <div className="skeleton-text mt-2"></div>
  </section>
);





// Component for Top Product Box
const CompBoxTopProduct = ({ props,handleRemove,category }) => {
   
  return (
    <section className="comp-box">
      {props.placeholder ? (
        <SkeletonBox  category={category}/>
      ) : (
        <>
          <div  className="position-relative">
           <Link to={props._id ? `/productdetail/${props._id}` : '/'}>
            <img src={props.productImage} className="compbox-img" alt="" />
           </Link>
            <CgCloseR size={20} color="red" className="position-absolute comp-delete" onClick={()=>handleRemove(props)} />
          </div>
          <div className="mt-1 sticky" style={{ top: '4rem' }}>
            <div className="comp-box-productdetails">
              <span>{props.product_name}</span>
            </div>
            <div className="comp-box-product-pricebox">
              <span> ₹{props.selling_price}</span>
              <span>{props.mrp_price}</span>
              <span>{Math.ceil(((props.mrp_price - props.selling_price) / props.mrp_price) * 100)} %</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};


// Component for Second Price Details
// const CompBoxSecondPriceDetails = ({props}) => {
//   return (
//     <section className="comp-box">
//       <div className="mt-4 sticky" style={{ top: '4rem' }}>
//         <div className="comp-box-productdetails">
//           <span className="">Lorem ipsum dolor</span>
//         </div>
//         <div className="comp-box-product-pricebox">
//           <span> ₹25000</span>
//           <span>3000</span>
//           <span>40%</span>
//         </div>
//       </div>
//     </section>
//   );
// };

// Component for Ratings and Reviews
const CompRatingAndReview = ({ props }) => {
  return (
    <section className="comp-box">
      {props.placeholder ? (
        <SkeletonRatingAndReview />
      ) : (
        <>
          <div className="rating-icon badge text-bg-success d-flex justify-content-start align-items-center gap-2" style={{ width: 'max-content', fontSize: '.8rem' }}>
            <FaStar size={15} color="white" />{props.averageRating}
          </div>
          <p className="text-secondary">{props.totalRating} ratings & {props.totalRating} Reviews</p>
        </>
      )}
    </section>
  );
};

// Component for Highlights
const CompHighlights = ({ props }) => {
  return (
    <section className="comp-box">
      {props.placeholder ? (
        <SkeletonHighlights />
      ) : (
        <ul className="comp-highlights">
          {props.highlight && props.highlight.length > 0 ? (
            props.highlight.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <p>___</p>
          )}
        </ul>
      )}
    </section>
  );
};


// Component for Delivery Information
const CompDelivery = ({ props }) => {
  return (
    <section className="comp-box">
      {props.placeholder ? (
        <SkeletonDelivery />
      ) : (
        <p className="comp-delivery"><span>30 Aug</span>, Monday </p>
      )}
    </section>
  );
};


// Component for Specifications
const CompSpecifications = ({ props }) => {
  return (
    <section className="comp-box">
      {props.placeholder ? (
        <SkeletonSpecifications />
      ) : (
        <div className="d-flex flex-column gap-2">
          <div className="mb-4"></div>
          {props.specifications && (
            <>
              <span>{props.specifications[0].dimensions || '_'}</span>
              <span>{props.specifications[0].color || '_'}</span>
              <span>{props.specifications[0].weight || '_'}</span>
              <span>{props.specifications[0].material || '_'}</span>
            </>
          )}
        </div>
      )}
    </section>
  );
};

// Component for Last Box
const CompLastBox = ({ props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ cart: false, buy: false });

  const handleAddToCart = useCallback(async () => {
    if (!props?._id || props.placeholder) return;
    if (!checkUser()) {
      navigate("/login");
      return;
    }
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      await dispatch(addtoCart(props._id, null, 1));
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  }, [dispatch, navigate, props]);

  const handleBuyNow = useCallback(async () => {
    if (!props?._id || props.placeholder) return;
    if (!checkUser()) {
      navigate("/login");
      return;
    }
    setLoading((prev) => ({ ...prev, buy: true }));
    try {
      const result = await dispatch(addSingleToOrderSummary(props._id, 1, null));
      if (result?.success) {
        navigate("/cart/ordersummary");
      }
    } finally {
      setLoading((prev) => ({ ...prev, buy: false }));
    }
  }, [dispatch, navigate, props]);

  return (
    <section className="comp-box d-flex flex-column justify-content-between">
      {props.placeholder ? (
        <SkeletonLastBox />
      ) : (
        <>
          <Link to={props._id ? `/productdetail/${props._id}` : '/'} className="position-relative">
            <img src={props.productImage || "/img/pottery4.jpg"} alt="" className="compbox-img" />
          </Link>
          <div className="comp-box-productdetails">
            <span className="">{props.product_name}</span>
          </div>
          <div className="comp-box-product-pricebox">
            <span> ₹{props.selling_price}</span>
            <span>{props.mrp_price}</span>
            <span>{Math.ceil(((props.mrp_price - props.selling_price) / props.mrp_price) * 100)}%</span>
          </div>
          <div className="px-4 d-flex flex-column justify-content-end align-items-center gap-2">
            <button
              type="button"
              className="comp-buttons comp-btn-buy"
              onClick={handleBuyNow}
              disabled={loading.buy || props.stock_quantity === 0}
            >
              <i className="fas fa-bolt px-2 kill"></i>
              {loading.buy ? "Processing..." : "BUY NOW"}
            </button>
            <button
              type="button"
              className="comp-buttons comp-btn-cart"
              onClick={handleAddToCart}
              disabled={loading.cart}
            >
              {loading.cart ? "Processing..." : "ADD TO CART"}
            </button>
          </div>
        </>
      )}
    </section>
  );
};


const initialPlaceholders = [
  { id: 1, placeholder: true },
  { id: 2, placeholder: true },
  { id: 3, placeholder: true }
];

const ComparisonPage = () => {
  const [products, setProducts] = useState(initialPlaceholders);
  const compareProducts = useSelector(state=>state.compare.data);
  const [checkstate,setCheckState] = useState(false)
  const dispatch = useDispatch();
  
  const handleRemove = useCallback((product) => {
    dispatch({
      type: REMOVE_COMPARE_PRODUCTS,
      payload: product,
    });
  
    // Filter out the removed product from the local state
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter(
        (item) => item._id !== product._id
      );
  
      // Add placeholder if necessary to keep the array length 3
      while (updatedProducts.length < 3) {
        updatedProducts.push({ id: updatedProducts.length + 1, placeholder: true });
      }
  
      return updatedProducts;
    });
  }, [dispatch]);
  

  useEffect(() => {
    const updatedProducts = [...initialPlaceholders];
  
    if (compareProducts && compareProducts.products.length > 0) {
      compareProducts.products.forEach((product, index) => {
        if (index < 3) {
          updatedProducts[index] = product;
        }
      });
      setProducts(updatedProducts);
    }
  }, [compareProducts]);
  
  

  useEffect(() => {
    const updatedProducts = [...products];
    if(compareProducts&& compareProducts.products.length>0){

      
      compareProducts.products.forEach((product, index) => {
        if (index < 3) {
          updatedProducts[index] = product;
        }
      });
      setProducts(updatedProducts);
    }
  }, []);
  console.log('cat',products[0]?.category);
  
  
  return (
    <>
      <div className="text-center">
        <h3 style={{fontWeight:600, textTransform:"capitalize"}} className="mt-2 ">compare products</h3>
      </div>
     {!products.placeholder >0 && <section className="comp-page-container" style={{ width: '100%' }}>
      
        <main className="d-flex justify-content-start align-item-center rowz mt-2 px-4 border-top border-2 border-secondary">
          <section className="comp-index sticky" style={{ bottom: '15px' }}>
            { products.map((item,index)=>(
              <span style={{color:'black'}} key={item._id}>{item.product_name} <br />
                 {index < products.length - 1 && ' (vs) '}
              </span>
            ))}
          </section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompBoxTopProduct key={index} props={item} handleRemove={handleRemove} category={products[0]?.category}/>
            ) : (
              <SkeletonBox key={index} category={products[0]?.category} />
            )
          )}
        </main>

        <main className="d-flex justify-content-start align-item-center rowz px-4 ">
          <section className="comp-index">
            <span>Ratings and Review</span>
          </section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompRatingAndReview key={index} props={item} />
            ) : (
              <SkeletonRatingAndReview key={index} />
            )
          )}
        </main>

        <main className="d-flex justify-content-start align-item-center rowz px-4 ">
          <section className="comp-index">
            <span>Highlights</span>
          </section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompHighlights key={index} props={item} />
            ) : (
              <SkeletonHighlights key={index} />
            )
          )}
        </main>

        <main className="d-flex justify-content-start align-item-center rowz px-4">
          <section className="comp-index">
            <span>Delivery</span>
          </section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompDelivery key={index} props={item} />
            ) : (
              <SkeletonDelivery key={index} />
            )
          )}
        </main>

        <main className="d-flex justify-content-start align-item-center rowz px-4">
          <section className="comp-index">
            <span>Specifications :</span>
            <div className="mt-2 d-flex flex-column gap-2 text-capitalize">
              <span>Dimensions</span>
              <span>Color</span>
              <span>Weight</span>
              <span>Material</span>
            </div>
          </section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompSpecifications key={index} props={item} />
            ) : (
              <SkeletonSpecifications key={index} />
            )
          )}
        </main>

        <main className="d-flex justify-content-start align-item-center rowz px-4">
          <section className="comp-index"></section>
          {products && products.map((item, index) =>
            Object.keys(item).length !== 0 ? (
              <CompLastBox key={index} props={item} />
            ) : (
              <SkeletonLastBox key={index} />
            )
          )}
        </main>
      </section>}
    </>
  );
};

export default ComparisonPage;