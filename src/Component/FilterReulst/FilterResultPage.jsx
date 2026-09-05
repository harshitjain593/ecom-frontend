import React, { useCallback } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FaStar as FullStar } from "react-icons/fa6";
import "../SearchResult/searchResult.css";
import { addtoCart, addWishList } from "../../action/productdetailaction";
import { findCartItem } from "../../utils/cartUtils";

const FilterResultPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.filteredProducts?.products?.products
  );
  const cartItems = useSelector((state) => state.CartData?.data?.cartItems);

  const handleAddtoCart = useCallback(
    (productId) => {
      dispatch(addtoCart(productId, null, 1));
    },
    [dispatch]
  );

  const handleAddtoWishlist = useCallback(
    (productId) => {
      dispatch(addWishList(productId));
    },
    [dispatch]
  );

  return (
    <>
      <section>
        <div className="first-box first-box-banner"></div>
        <h2 className="badge text-bg-warning py-2 fs-1 mx-auto d-flex justify-content-center">
          {id}
        </h2>
        <div className="s-container">
          {products &&
            products.map((product) => {
              const inCart = Boolean(
                findCartItem(cartItems, product._id, null)
              );
              return (
                <main key={product._id}>
                  <Link
                    to={`/productdetail/${product._id}`}
                    className="s-pic-container"
                  >
                    <img src={product.productImage} alt="blank" />
                  </Link>
                  <div className="s-text-main-container">
                    <div className="s-text-container">
                      <Link to={`/productdetail/${product._id}`}>
                        {product.product_name}
                      </Link>
                      <div className="rating">
                        <div>
                          Rating : <FullStar size={18} className="" /> 5
                        </div>
                      </div>
                    </div>
                    <div className="s-price-details-container">
                      <div>
                        <h5 className="fs-md-3">₹{product.selling_price}</h5>
                        <h6 className="text-muted">
                          M.R.P ₹{product.mrp_price}
                        </h6>
                        <h6>
                          <span
                            style={{ fontWeight: 500 }}
                            className="text-success"
                          >
                            Save{" "}
                            {(
                              ((product.mrp_price - product.selling_price) /
                                product.mrp_price) *
                              100
                            ).toFixed(0)}
                            %
                          </span>{" "}
                        </h6>
                      </div>
                    </div>
                    <div className="s-button-container">
                      {inCart ? (
                        <Link to="/cart">In cart</Link>
                      ) : (
                        <button onClick={() => handleAddtoCart(product._id)}>
                          add to cart
                        </button>
                      )}
                      <button onClick={() => handleAddtoWishlist(product._id)}>
                        {" "}
                        wishlist <FaRegHeart />{" "}
                      </button>
                    </div>
                  </div>
                </main>
              );
            })}
        </div>
      </section>
    </>
  );
};

export default FilterResultPage;
