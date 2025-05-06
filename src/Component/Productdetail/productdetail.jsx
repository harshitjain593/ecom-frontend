import React, { useCallback, useEffect, useState } from "react";
import css from "./productdetails.module.css";
import Excusivecategory from "../Home/Excusivecategory";
import ReactImageMagnify from "react-image-magnify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart, getProductDetails } from "../../action/productdetailaction";
import { addWishList } from "../../action/productdetailaction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addRecentProduct } from "../../action/recentProductAction";
import { addSingleToOrderSummary } from "../../action/orderSummaryAction";
import HeartButton from "../Home/HeartButton";
import { checkDelivery } from "../../action/Delivery";
import ReviewComments from "../ReviewDisplay/Reviewcomments";
import { checkUser, formatNumberWithCommas } from "../../assest/js/checker";
import addCompareProducts from "../../action/compareProducts";

import {
  ADD_COMPARE_PRODUCTS,
  DIRECT_BUY_ADD_TO_PRODUCTS,
  REMOVE_COMPARE_PRODUCTS,
} from "../../action/actionType";
import useLocal from "../../service/compare";
import CompareError from "../comparePOPup/CompareError";
import ComparePOPup from "../comparePOPup/ComparePOPup";
import { checkcompare } from "../../service/checkCompareproduct";
import Slider from "react-slick";

import { NextArrow, PrevArrow } from "../Home/Arrow";
import { CatNextArrow, CatPrevArrow } from "../Home/CatArrows";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp    } from "react-icons/io";

const sliderSettings = {
  dots: false, // Shows navigation dots
  infinite: true, // Enables infinite loop sliding
  speed: 500, // Transition speed in milliseconds
  slidesToShow: 1, // Number of slides to show
  slidesToScroll: 1, // Number of slides to scroll at a time
  autoplay: false, // Enables autoplay
  autoplaySpeed: 3000, // Time between each slide in autoplay mode
  arrows: true, // Show next/previous arrows
  nextArrow: <CatNextArrow />,
  prevArrow: <CatPrevArrow />,
  responsive: [
    // Responsive settings for different screen sizes
    {
      breakpoint: 768, // At or below this screen width
      settings: {
        slidesToShow: 1, // Show 1 image on smaller screens as well
        slidesToScroll: 1,
      },
    },
  ],
};

function Productdetail() {
  const [pincodeMessage, setPincodeMessage] = useState("");
  const navigate = useNavigate();
  const [deliveryData, setDeliveryData] = useState(null);
  const [pincodeError, setPincodeError] = useState("");
  const [timeOutId, setTimeoutId] = useState("");
  const product = useSelector((state) => state.productDetails.product);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const params = useParams();
  const id = params.id;
  const [updatepage, setUpdatepage] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [colorOptions, setColorOptions] = useState(null);
  const dispatch = useDispatch();
  const [isCompared, setIsCompared] = useState(false);
  const directbuy = useSelector((state) => state.directBuy);
  const [isExpanded, setIsExpanded] = useState({
    description: true,
    highlight: true,
    returnPolicy: true,
  });
  const [buttonLoader, setButtonLoader] = useState({
    addtocart: false,
    buynow: false,
  });
  const checkDeliveryData = useSelector(
    (state) => state.checkDelivery?.data?.delivery_codes
  );
  const compareProducts = useSelector((state) => state.compare.data);
  useEffect(() => {
    if (product && compareProducts.products.length > 0) {
      setIsCompared((prev) =>
        checkcompare(product._id, compareProducts.products)
      );
    }
  }, [product, compareProducts]);

  useEffect(() => {
    dispatch(getProductDetails(id));
    dispatch(addRecentProduct(id));
  }, [dispatch, id, buttonLoader.addtocart, updatepage]);

  useEffect(() => {
    if (product) {
      setMainImage(product.productImage);
    }
  }, [product]);

  const handleImageClick = useCallback((image) => {
    setMainImage(image);
  }, []);

  const handleColorOptions = useCallback(
    (obj) => {
      setColorOptions((prev) => obj);
      handleImageClick(obj.product_image);
    },
    [colorOptions]
  );

  const handleIncrease = useCallback(() => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  }, []);

  const handleDecrease = useCallback(() => {
    setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  }, []);

  const addToWishlist = useCallback(
    (productId) => {
      if (!checkUser()) {
        navigate("/wishlist");
        return;
      }
      dispatch(addWishList(productId));
    },
    [dispatch]
  );

  const handeaddtoCart = useCallback(
    async (productId) => {
      if (!checkUser()) {
        navigate("/cart");
        return;
      }
      setButtonLoader((prevState) => ({
        ...prevState,
        addtocart: true,
      }));

      console.log(colorOptions, "add to cart");
      await dispatch(
        addtoCart(productId, colorOptions && colorOptions._id, quantity)
      ).then(() => {
        setButtonLoader((prevState) => ({
          ...prevState,
          addtocart: false,
        }));
      });
    },
    [quantity, dispatch, colorOptions]
  );

  const directBuy = useCallback(
    (product, colorId) => {
      setButtonLoader((prevState) => ({
        ...prevState,
        buynow: true,
      }));
      dispatch({
        type: DIRECT_BUY_ADD_TO_PRODUCTS,
        payload: {
          product,
          quantity,
          colorId,
        },
      });
      setButtonLoader((prevState) => ({
        ...prevState,
        buynow: false,
      }));
      navigate("/cart/ordersummary");
    },
    [dispatch, directbuy, quantity]
  );

  const handleBuynow = useCallback(async () => {
    if (!checkUser()) {
      console.log("color before direct buy", colorOptions);
      directBuy(product, colorOptions ? colorOptions._id : product._id);
      return;
    }
    setButtonLoader((prevState) => ({
      ...prevState,
      buynow: true,
    }));
    await dispatch(
      addSingleToOrderSummary(
        product._id,
        quantity,
        colorOptions && colorOptions._id
      )
    ).then(() => {
      setButtonLoader((prevState) => ({
        ...prevState,
        buynow: false,
      }));
      navigate("/cart/ordersummary");
    });
  }, [dispatch, navigate, product, quantity, colorOptions]);

  const handlePincodeChange = useCallback(
    (e) => {
      setPincodeMessage("");
      const newPincode = e.target.value;
      setPincode(newPincode);
      clearTimeout(timeOutId);

      if (newPincode.length < 6 || isNaN(Number(newPincode))) {
        setPincodeError("Please enter a valid pincode");
        return;
      } else {
        setPincodeError("");
        dispatch(checkDelivery(Number(newPincode)));
      }
    },
    [timeOutId, dispatch]
  );

  useEffect(() => {
    if (checkDeliveryData && checkDeliveryData.length > 0) {
      const deliveryInfo = checkDeliveryData[0]?.postal_code;
      if (deliveryInfo) {
        setPincodeMessage(
          deliveryInfo.cod === "Y"
            ? "Delivery Available"
            : "Currently not Available"
        );
        setDeliveryData(deliveryInfo);
      } else {
        setPincodeMessage("Currently not Available");
      }
    } else {
      setPincodeMessage("Currently not Available");
    }
  }, [checkDeliveryData]);

  const addtoCompareList = useCallback(
    (e, product) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        // Adding product: Check for duplicates
        dispatch({
          type: ADD_COMPARE_PRODUCTS,
          payload: product,
        });

        setIsCompared(true);
      } else {
        // Removing product
        dispatch({
          type: REMOVE_COMPARE_PRODUCTS,
          payload: product,
        });
        setIsCompared(false);
      }
    },
    [compareProducts, dispatch]
  );

  const handleViewLess = (element) => {
    setIsExpanded((prev) => ({ ...prev, [element]: !prev[element] }));
  };

  const specification = product?.specifications[0] || null;

  return (
    <>
      <section className="container-fluid py-3">
        <div className={css.pdetailRow}>
          {product ? (
            <>
              <div className="col-lg-5  col-sm-12 justify-content-sm-center align-items-sm-center ">
                <div className="position-lg-sticky top-0 ">
                  <div
                    className={`${css.mobilePicContainer} positions-relative mx-auto`}
                  >
                    <div
                      className={css.moblieheartContianer}
                      style={{
                        position: "absolute",
                        color: "gray",
                        fontSize: "24px",
                        cursor: "pointer",
                      }}
                    >
                      <HeartButton
                        productId={product._id}
                        check={product.isWishlist}
                      />
                    </div>
                    <div>
                      {colorOptions ? (
                        colorOptions.imageGallery.length > 1 ? (
                          <Slider {...sliderSettings}>
                            {colorOptions.imageGallery.map((item, index) => (
                              <img
                                className={css.mobileImg}
                                key={index}
                                src={item}
                                alt=""
                              />
                            ))}
                          </Slider>
                        ) : (
                          <img
                            className={css.mobileImg}
                            src={
                              colorOptions?.product_image ||
                              product.productImage
                            }
                            alt=""
                          />
                        )
                      ) : product.image_gallery.length > 1 ? (
                        <Slider {...sliderSettings}>
                          {product.image_gallery.map((item, index) => (
                            <img
                              className={css.mobileImg}
                              key={index}
                              src={item}
                              alt=""
                            />
                          ))}
                        </Slider>
                      ) : (
                        <img
                          className={css.mobileImg}
                          src={
                            colorOptions?.product_image || product.productImage
                          }
                          alt=""
                        />
                      )}
                    </div>
                    <div className={` ${css.moblilepDetailButtonContainer}`}>
                      {product.isCart ? (
                        <Link
                          to={"/cart"}
                          className={`${css.buttons} me-2 text-white`}
                          style={{ background: "#FF9F00" }}
                        >
                          <i className="fas fa-shopping-cart px-2"></i> Go to
                          Cart
                        </Link>
                      ) : (
                        <button
                          className={`${css.buttons} me-2 text-white`}
                          onClick={() => handeaddtoCart(product._id)}
                          style={{ background: "#FF9F00" }}
                        >
                          {buttonLoader.addtocart ? (
                            <div className="spinner"></div>
                          ) : (
                            <>
                              <i className="fas fa-shopping-cart px-2"></i> ADD
                              TO CART
                            </>
                          )}
                        </button>
                      )}
                      <button
                        className={`${css.buttons} me-2 text-white`}
                        style={{
                          background:
                            product.stock_quantity === 0 ? "gray" : "#FB641B",
                        }}
                      >
                        <button
                          className="text-white"
                          onClick={(e) =>
                            product.stock_quantity === 0 ? "" : handleBuynow(e)
                          }
                          disabled={product.stock_quantity - 100 === 10}
                        >
                          {buttonLoader.buynow ? (
                            <div className="spinner"></div>
                          ) : (
                            <>
                              <i className="fas fa-bolt px-2"></i> BUY NOW
                            </>
                          )}
                        </button>
                      </button>
                    </div>
                  </div>
                  <div className={`d-flex  ${css.picsMainContainer}`}>
                    <section className="">
                    <div
                      className={`${css.picGrid} d-none d-md-flex  flex-column gap-1 justify-content-between`}
                    >
                      {colorOptions && colorOptions.imageGallery.length > 0
                        ? colorOptions.imageGallery.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              onClick={() => handleImageClick(image)}
                              style={{ height: "80px", width: "80px" }}
                              className={`border d-flex justify-content-center `}
                            />
                          ))
                        : product.image_gallery &&
                          product.image_gallery.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              onClick={() => handleImageClick(image)}
                              style={{ height: "80px", width: "80px" }}
                              className={`border d-flex justify-content-center `}
                            />
                          ))}
                    </div>

                    </section>
                    <section className={css.pDetailsImageSectionwithButton}>
                    <div
                      className={css.imageMagnifyContainer}
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #d0cece",
                      }}
                    >
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: "e-commerce",
                            isFluidWidth: true,
                            src: mainImage || product.productImage,
                          },
                          largeImage: {
                            src: mainImage || product.productImage,
                            style: { borderRadius: "10px" },
                          },
                          enlargedImagePosition: "beside",
                          enlargedImageContainerStyle: { zIndex: 20 },
                          enlargedImageContainerDimensions: {
                            width: "100%",
                            height: "100%",
                          },
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "30px",
                          right: "10px",
                          color: "gray",
                          fontSize: "24px",
                          cursor: "pointer",
                        }}
                      >
                        <HeartButton
                          productId={product._id}
                          check={product.isWishlist}
                        />
                      </div>
                    </div>     
                    <div
                      className={`d-flex justify-content-lg-start justify-content-md-center mt-2 align-items-center ${css.pDetailButtonContainer}`}
                    >
                      {product.isCart ? (
                        <Link
                          to={"/cart"}
                          className="px-4 py-3 me-2 text-white"
                          style={{ background: "#FF9F00" }}
                        >
                          <i className="fas fa-shopping-cart px-2"></i> Go to Cart
                        </Link>
                      ) : (
                        <button
                          className={`${css.buttons} me-2 text-white`}
                          onClick={() => handeaddtoCart(product._id)}
                          style={{ background: "#FF9F00" }}
                        >
                          {buttonLoader.addtocart ? (
                            <div className="spinner"></div>
                          ) : (
                            <>
                              <i className="fas fa-shopping-cart px-2"></i> ADD TO
                              CART
                            </>
                          )}
                        </button>
                      )}
                      <button
                        className={`${css.buttons} me-2 text-white`}
                        style={{
                          background:
                            product.stock_quantity === 0 ? "gray" : "#FB641B",
                        }}
                        disabled={product.stock_quantity === 10}
                      >
                        <button
                          className="text-white "
                          onClick={(e) =>
                            product.stock_quantity === 0 ? "" : handleBuynow(e)
                          }
                        >
                          {buttonLoader.buynow ? (
                            <div className="spinner"></div>
                          ) : (
                            <>
                              <i className="fas fa-bolt px-2"></i> BUY NOW
                            </>
                          )}
                        </button>
                      </button>
                    </div>
                    </section>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 pl-1 ">
                <div>
                  <section className="px-4" style={{ position: "static" }}>
                    <div>
                      <div className="d-flex align-items-center justify-content-end gap-3 mt-2 mt-lg-0">
                        <label htmlFor="compare">Compare Product</label>
                        <input
                          type="checkbox"
                          name="compare"
                          id="compare"
                          className="px-2 py-2"
                          checked={isCompared}
                          onChange={(e) => addtoCompareList(e, product)}
                        />
                      </div>

                      <h3>
                        {colorOptions
                          ? colorOptions.productName
                          : product.product_name}
                      </h3>
                      <span style={{ fontSize: "12px" }}>
                        {product.category} &#62; {product.sub_category}
                      </span>
                    </div>

                    <div>
                      <div className="d-flex justify-content-start">
                        <span className="fs-4" style={{ fontWeight: "500" }}>
                          ₹{formatNumberWithCommas(product.selling_price)}
                        </span>
                        <del
                          className="px-2 py-1"
                          style={{ fontWeight: "500", color: "gray" }}
                        >
                          ₹{product.mrp_price}
                        </del>
                        <span
                          className="px-2 py-2 text-success"
                          style={{ fontWeight: "500", fontSize: "12px" }}
                        >
                          {(
                            ((product.mrp_price - product.selling_price) /
                              product.mrp_price) *
                            100
                          ).toFixed(1)}
                          % off
                        </span>
                      </div>
                      <span style={{ fontSize: "12px" }}>
                        include of all taxes
                      </span>
                    </div>
                    <div className="qty-container mt-2">
                      <button
                        className="qty-btn-minus btn-light bg-light rounded"
                        type="button"
                        onClick={handleDecrease}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        className="input-qty text-center mx-2"
                        readOnly
                      />
                      <button
                        className="qty-btn-plus btn-light rounded bg-light"
                        type="button"
                        onClick={handleIncrease}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <section className="mt-2 position-static">
                      <div className="delivery-section">
                        <h6 className={css.SubHeads}>Check Delivery</h6>
                        <div>
                          <input
                            type="text"
                            value={pincode}
                            className={css.picodeInput}
                            onChange={handlePincodeChange}
                            placeholder="Enter Pincode"
                            maxLength={6}
                            onBlur={() => setPincodeError("")}
                          />
                          {pincodeError && (
                            <span className="text-danger d-block">
                              {pincodeError}
                            </span>
                          )}
                        </div>
                        {pincode.length === 6 && (
                          <div>
                            <p
                              className={
                                deliveryData ? "text-success" : "text-danger"
                              }
                              style={{ fontSize: ".8rem" }}
                            >
                              {pincodeMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  </section>
                  <section className="mt-2 position-static">
                    <div className="container m-0 p-0 px-4">
                      <div className="row">
                        <div className="col-12 pt-1">
                          {product.stock_quantity && (
                            <p
                              className={
                                product.stock_quantity < 10
                                  ? "text-danger"
                                  : "text-success"
                              }
                              style={{
                                fontWeight: 500,
                                lineHeight: "15px",
                                margin: "0px",
                              }}
                            >
                              {product.stock_quantity < 10
                                ? `!! Hurry Only ${product.stock_quantity}  Left`
                                : `!! Available stocks of ${product.stock_quantity} `}
                            </p>
                          )}
                          {product.colorOption.length > 0 && (
                            <section className="mt-2 position-static">
                              <div className="container m-0 p-0 px-0">
                                <div className="row">
                                  <div className="col-12 pt-1">
                                    <h6 className={css.SubHeads}>Variants</h6>
                                    {product.colorOption.length > 0 && (
                                      <div
                                        className={`${css.pdetailscolorOptions} `}
                                      >
                                        {product.colorOption.length > 0 &&
                                          product.colorOption.map((item, i) => (
                                            <div
                                              className={
                                                css.colorOptionsimgContainer
                                              }
                                              onClick={() =>
                                                handleColorOptions(item)
                                              }
                                            >
                                              <img
                                                src={item.product_image}
                                                alt=""
                                              />
                                              {/* <span>{item.colorName}</span> */}
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}

                          <h6 className={css.SubHeads}>Description</h6>
                          <p className="m-0 mt-2 ">
                            {isExpanded.description
                              ? product.description.substring(0, 200)
                              : product.description}
                          </p>
                          <div
                            onClick={() => handleViewLess("description")}
                            className="text-center"
                          >
                            {isExpanded.description ? (
                              <div
                                className="text-center  p-1 rounded"
                                style={{
                                  width: "max-content",
                                  fontSize: ".8rem",
                                  fontWeight: 500,
                                }}
                              >
                              { product.description.toString().length > 100 &&(
                                <>
                               <IoIosArrowDown size={15} /> 
                               </>
                            )}
                              </div>
                            ) : (
                              <div
                                className="p-1 rounded"
                                style={{
                                  width: "max-content",
                                  fontSize: ".8rem",
                                  fontWeight: 500,
                                }}
                              >
                                  { product.description.toString().length > 100 && (
                                <>
                                <small>view less</small> <IoIosArrowUp size={15}  /> 
                               </>
                            )}
                              </div>
                            )}{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {product.return_policy.length > 0 && (
                    <section className="mt-2 position-static">
                      <div className="container m-0 p-0 px-4">
                        <div className="row">
                          <div className="col-12 pt-1">
                            <h6 className={css.SubHeads}>Return Policy</h6>

                            <ul className={`${css.highlightul} px-4`}>
                              {product.return_policy.map((item, index) => {
                                // If expanded, show all items, otherwise show only the first 3
                                if ( !isExpanded.returnPolicy || index < 3) {
                                  return <li key={index}>{item}</li>;
                                }
                                return null; // Return null when not showing the item
                              })}

                              {/* Toggle button to view more or less */}
                              <div
                                onClick={() => handleViewLess("returnPolicy")}
                                className="text-center"
                              >
                                {isExpanded.returnPolicy    ? (
                                  <div
                                    className="text-center p-1 rounded"
                                    style={{
                                      width: "max-content",
                                      fontSize: ".8rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                  {product.return_policy.length > 3 && (
                                    <>
                                      <IoIosArrowDown size={15}/>
                                    </>
                                  ) }
                                  </div>
                                ) : (
                                  <div
                                    className="p-1 rounded"
                                    style={{
                                      width: "max-content",
                                      fontSize: ".8rem",
                                    }}
                                  >
                                       {product.return_policy.length > 3 && (
                                    <>
                                    <small>View less</small>  <IoIosArrowUp size={15} /> 
                                    </>
                                  ) }
                                  </div>
                                )}
                              </div>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {product.highlight.length > 0 && (
                    <section className="mt-2 position-static">
                      <div className="container m-0 p-0 px-4">
                        <div className="row">
                          <div className="col-12 pt-1">
                            <h6 className={css.SubHeads}>Highlights</h6>

                            <ul className={`${css.highlightul} px-4`}>
                              {product.highlight.map((item, index) => {
                                // Show all items if expanded, otherwise limit to first 3
                                if (!isExpanded.highlight || index < 3) {
                                  return <li key={index}>{item}</li>;
                                }
                                return null; // Return null when not showing the item
                              })}

                              {/* Toggle button to view more or less */}
                              <div
                                onClick={() => handleViewLess("highlight")}
                                className="text-center"
                              >
                                {isExpanded.highlight ? (
                                  <div
                                    className="text-center p-1 rounded"
                                    style={{
                                      width: "max-content",
                                      fontSize: ".8rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                        {product.highlight.length > 3 && (
                                    <>
                                      <IoIosArrowDown size={15} /> 
                                    </>
                                  ) }
                                  </div>
                                ) : (
                                  <div
                                    className="p-1 rounded"
                                    style={{
                                      width: "max-content",
                                      fontSize: ".8rem",
                                    }}
                                  >
                                        {product.highlight.length > 3 && (
                                    <>
                                    <small>View less</small>  <IoIosArrowUp size={15}  /> 
                                    </>
                                  ) }
                                  </div>
                                )}
                              </div>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="mt-2 position-static">
                    <div className="container m-0 p-0 px-4">
                      <div className="row">
                        <div className="col-12 pt-1">
                          <h6 className={css.SubHeads}>Specifications</h6>
                          <table className={css.specificationTable}>
                            <tbody>
                              {specification &&
                                Object.entries(specification).map(
                                  ([key, value], index) => (
                                    <tr key={index}>
                                      <th>{key}</th>
                                      <td>{value}</td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </section>
      {product && (
        <ReviewComments product={product} setUpdatepage={setUpdatepage} />
      )}

      {compareProducts && compareProducts.products.length > 0 && (
        <ComparePOPup products={compareProducts.products} />
      )}
      {/* {local && localError &&
      <CompareError error={localError}/>
      } */}
      <Excusivecategory />
    </>
  );
}

export default Productdetail;
