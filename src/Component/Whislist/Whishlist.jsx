import { CheckUserComponent } from "../Auth/checkComponent/CheckUserComponent";
import React, { useCallback, useEffect, useState } from "react";
import "./whishlist.css";
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
  const navigate = useNavigate();
  const [loggedIn] = useState(checkUser());
  const wishlistData = useSelector((state) => state?.WishlistData?.data);
  const cartItems = useSelector((state) => state?.CartData?.data?.cartItems);
  const dispatch = useDispatch();

  const RemoveFromWishlist = useCallback(
    (productId) => {
      dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getWishlist());
    if (checkUser()) {
      dispatch(getCart());
    }
  }, [dispatch]);

  const MoveToCarts = useCallback(
    async (productId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/mobileApi/cart/move-product-to-cart/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          const { statusCode, result } = data;
          if (statusCode === 200) {
            dispatch({
              type: MOVE_TO_CART,
              payload: productId,
            });
            dispatch(getCart());
          } else {
            toast.error("Could not move product to cart");
          }
        } else {
          throw new Error("Failed to move product to cart");
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    },
    [dispatch]
  );

  const handleMoveToCart = useCallback(
    (id) => {
      MoveToCarts(id);
    },
    [MoveToCarts]
  );

  const handleNavigate = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const products = wishlistData?.products || [];

  return (
    <>
      {loggedIn ? (
        <section>
          <div className="wish-banner position-relative">
            <div className="wishlist-head position-absolute ">
              <h2>Wishlist</h2>
              <p>Mastery of Handcrafts</p>
            </div>
          </div>
          {products.length > 0 ? (
            <main className="wishlist-list">
              <ul className="wishlist-items">
                {products.map((product) => {
                  const inCart = Boolean(
                    findCartItem(cartItems, product._id, null)
                  );
                  return (
                    <li className="wishlist-item" key={product._id}>
                      <button
                        type="button"
                        className="wishlist-item__remove"
                        aria-label="Remove from wishlist"
                        onClick={() => RemoveFromWishlist(product._id)}
                      >
                        <MdClose size={22} />
                      </button>

                      <Link
                        to={`/productdetail/${product._id}`}
                        className="wishlist-item__thumb"
                      >
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.product_name || ""}
                          />
                        ) : (
                          <div className="wishlist-img-fallback">No image</div>
                        )}
                      </Link>

                      <div className="wishlist-item__details">
                        <Link
                          to={`/productdetail/${product._id}`}
                          className="wishlist-item__name"
                        >
                          {product.product_name || "Product unavailable"}
                        </Link>
                        <p className="wishlist-item__price">
                          ₹{product.selling_price ?? "—"}
                        </p>
                        <p className="wishlist-item__stock">
                          {product.stock_quantity > 0
                            ? "In stock"
                            : "Not available"}
                        </p>
                        {inCart ? (
                          <Link to="/cart" className="wishlist-item__action">
                            In cart — Go to Cart →
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="wishlist-item__action"
                            onClick={() => handleMoveToCart(product._id)}
                          >
                            Add to Cart →
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </main>
          ) : (
            <div className="mt-2 text-center">
              <p className="text-center fs-4 text-black">
                No products in wishlist. Continue shopping
              </p>
              <button
                className="badge text-bg-warning py-2 py-3 fs-5"
                onClick={() => {
                  navigate("/");
                }}
              >
                shop now
              </button>
            </div>
          )}
        </section>
      ) : (
        <CheckUserComponent>
          <div
            className="mt-4 d-flex flex-column  justify-center"
            style={{ color: "black" }}
          >
            <p className="text-center" style={{ fontWeight: 500 }}>
              Missing Wishlist items?
            </p>
            <p className="text-center" style={{ fontWeight: 300 }}>
              Login to see the items you added previously
            </p>
            <button className="btn  px-4" onClick={handleNavigate}>
              {" "}
              login
            </button>
          </div>
        </CheckUserComponent>
      )}
    </>
  );
};

export default Whishlist;
