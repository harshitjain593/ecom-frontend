import React, { useCallback, useEffect, useState } from "react";
import css from "./productdetails.module.css";
import "./productTheme.css";
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
import {
  ADD_COMPARE_PRODUCTS,
  DIRECT_BUY_ADD_TO_PRODUCTS,
  REMOVE_COMPARE_PRODUCTS,
} from "../../action/actionType";
import { checkcompare } from "../../service/checkCompareproduct";
import ComparePOPup from "../comparePOPup/ComparePOPup";
import Slider from "react-slick";
import { CatNextArrow, CatPrevArrow } from "../Home/CatArrows";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  arrows: true,
  nextArrow: <CatNextArrow />,
  prevArrow: <CatPrevArrow />,
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

  const handleColorOptions = useCallback((obj) => {
    setColorOptions(obj);
    handleImageClick(obj.product_image);
  }, [handleImageClick]);

  const handleIncrease = useCallback(() => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  }, []);

  const handleDecrease = useCallback(() => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  }, []);

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

      await dispatch(
        addtoCart(productId, colorOptions && colorOptions._id, quantity)
      ).then(() => {
        setButtonLoader((prevState) => ({
          ...prevState,
          addtocart: false,
        }));
      });
    },
    [quantity, dispatch, colorOptions, navigate]
  );

  const directBuy = useCallback(
    (productItem, colorId) => {
      setButtonLoader((prevState) => ({
        ...prevState,
        buynow: true,
      }));
      dispatch({
        type: DIRECT_BUY_ADD_TO_PRODUCTS,
        payload: {
          product: productItem,
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
    [dispatch, quantity, navigate]
  );

  const handleBuynow = useCallback(async () => {
    if (!checkUser()) {
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
  }, [dispatch, navigate, product, quantity, colorOptions, directBuy]);

  const handlePincodeChange = useCallback(
    (e) => {
      setPincodeMessage("");
      const newPincode = e.target.value;
      setPincode(newPincode);
      clearTimeout(timeOutId);

      if (newPincode.length < 6 || isNaN(Number(newPincode))) {
        setPincodeError("Please enter a valid pincode");
        return;
      }
      setPincodeError("");
      dispatch(checkDelivery(Number(newPincode)));
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
    } else if (pincode.length === 6) {
      setPincodeMessage("Currently not Available");
    }
  }, [checkDeliveryData, pincode.length]);

  const addtoCompareList = useCallback(
    (e, productItem) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        dispatch({
          type: ADD_COMPARE_PRODUCTS,
          payload: productItem,
        });
        setIsCompared(true);
      } else {
        dispatch({
          type: REMOVE_COMPARE_PRODUCTS,
          payload: productItem,
        });
        setIsCompared(false);
      }
    },
    [dispatch]
  );

  const handleViewLess = (element) => {
    setIsExpanded((prev) => ({ ...prev, [element]: !prev[element] }));
  };

  const renderGalleryImages = () => {
    if (colorOptions?.imageGallery?.length > 0) {
      return colorOptions.imageGallery;
    }
    return product?.image_gallery || [];
  };

  const renderMainImageSrc = () => {
    return mainImage || colorOptions?.product_image || product?.productImage;
  };

  const renderActionButtons = (className) => {
    const outOfStock = product?.stock_quantity === 0;

    return (
      <div className={className}>
        {product.isCart ? (
          <Link to="/cart" className="product-page__btn product-page__btn--cart">
            <i className="fas fa-shopping-cart px-2" /> Go to Cart
          </Link>
        ) : (
          <button
            type="button"
            className="product-page__btn product-page__btn--cart"
            onClick={() => handeaddtoCart(product._id)}
          >
            {buttonLoader.addtocart ? (
              <div className="spinner" />
            ) : (
              <>
                <i className="fas fa-shopping-cart px-2" /> Add to Cart
              </>
            )}
          </button>
        )}
        <button
          type="button"
          className={`product-page__btn product-page__btn--buy ${
            outOfStock ? "product-page__btn--disabled" : ""
          }`}
          onClick={() => !outOfStock && handleBuynow()}
          disabled={outOfStock}
        >
          {buttonLoader.buynow ? (
            <div className="spinner" />
          ) : (
            <>
              <i className="fas fa-bolt px-2" /> Buy Now
            </>
          )}
        </button>
      </div>
    );
  };

  const specification = product?.specifications?.[0] || null;
  const galleryImages = product ? renderGalleryImages() : [];
  const displayName = colorOptions?.productName || product?.product_name;
  const discountPercent = product
    ? (
        ((product.mrp_price - product.selling_price) / product.mrp_price) *
        100
      ).toFixed(1)
    : 0;

  return (
    <>
      <section className="product-page">
        <div className="product-page__container">
          {!product ? (
            <div className="product-page__loader">
              <div className="loader" />
            </div>
          ) : (
            <div className="product-page__layout">
              <div className="product-page__gallery">
                <div className="product-page__mobile-gallery">
                  <div className="product-page__wishlist">
                    <HeartButton
                      productId={product._id}
                      check={product.isWishlist}
                    />
                  </div>
                  {galleryImages.length > 1 ? (
                    <Slider {...sliderSettings}>
                      {galleryImages.map((item, index) => (
                        <img
                          key={index}
                          className={css.mobileImg}
                          src={item}
                          alt={displayName}
                        />
                      ))}
                    </Slider>
                  ) : (
                    <img
                      className={css.mobileImg}
                      src={renderMainImageSrc()}
                      alt={displayName}
                    />
                  )}
                  {renderActionButtons("product-page__actions product-page__actions--mobile")}
                </div>

                <div className="product-page__gallery-inner">
                  <div className="product-page__thumbs d-none d-md-flex">
                    {galleryImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        onClick={() => handleImageClick(image)}
                        className={`product-page__thumb ${
                          renderMainImageSrc() === image ? "is-active" : ""
                        }`}
                      />
                    ))}
                  </div>

                  <div className="product-page__main-image">
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: displayName,
                          isFluidWidth: true,
                          src: renderMainImageSrc(),
                        },
                        largeImage: {
                          src: renderMainImageSrc(),
                        },
                        enlargedImagePosition: "beside",
                        enlargedImageContainerStyle: { zIndex: 20 },
                      }}
                    />
                    <div className="product-page__wishlist d-none d-md-block">
                      <HeartButton
                        productId={product._id}
                        check={product.isWishlist}
                      />
                    </div>
                  </div>
                </div>

                {renderActionButtons("product-page__actions")}
              </div>

              <div className="product-page__info">
                <div className="product-page__compare">
                  <label htmlFor="compare">Compare Product</label>
                  <input
                    type="checkbox"
                    name="compare"
                    id="compare"
                    checked={isCompared}
                    onChange={(e) => addtoCompareList(e, product)}
                  />
                </div>

                <p className="product-page__breadcrumb">
                  {product.category}
                  {product.sub_category ? ` › ${product.sub_category}` : ""}
                </p>

                <h1 className="product-page__title">{displayName}</h1>

                <div className="product-page__price-row">
                  <span className="product-page__price">
                    ₹{formatNumberWithCommas(product.selling_price)}
                  </span>
                  <del className="product-page__mrp">
                    ₹{formatNumberWithCommas(product.mrp_price)}
                  </del>
                  <span className="product-page__discount">{discountPercent}% off</span>
                </div>
                <p className="product-page__tax-note">Inclusive of all taxes</p>

                <div className="product-page__qty">
                  <button type="button" onClick={handleDecrease} aria-label="Decrease quantity">
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input type="text" value={quantity} readOnly aria-label="Quantity" />
                  <button type="button" onClick={handleIncrease} aria-label="Increase quantity">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                <div className="product-page__block">
                  <h2 className="product-page__heading">Check Delivery</h2>
                  <input
                    type="text"
                    value={pincode}
                    className="product-page__delivery-input"
                    onChange={handlePincodeChange}
                    placeholder="Enter pincode"
                    maxLength={6}
                    onBlur={() => setPincodeError("")}
                  />
                  {pincodeError && (
                    <span className="text-danger d-block mt-1">{pincodeError}</span>
                  )}
                  {pincode.length === 6 && (
                    <p
                      className={`mt-2 mb-0 ${
                        deliveryData ? "text-success" : "text-danger"
                      }`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {pincodeMessage}
                    </p>
                  )}
                </div>

                {product.stock_quantity != null && (
                  <p
                    className={`product-page__stock ${
                      product.stock_quantity < 10
                        ? "product-page__stock--low"
                        : "product-page__stock--ok"
                    }`}
                  >
                    {product.stock_quantity < 10
                      ? `Only ${product.stock_quantity} left in stock`
                      : `${product.stock_quantity} available`}
                  </p>
                )}

                {product.colorOption?.length > 0 && (
                  <div className="product-page__block">
                    <h2 className="product-page__heading">Variants</h2>
                    <div className="product-page__variants">
                      {product.colorOption.map((item) => (
                        <button
                          type="button"
                          key={item._id || item.product_image}
                          className={`product-page__variant ${
                            colorOptions?._id === item._id ? "is-selected" : ""
                          }`}
                          onClick={() => handleColorOptions(item)}
                        >
                          <img src={item.product_image} alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.description && (
                  <div className="product-page__block">
                    <h2 className="product-page__heading">Description</h2>
                    <p className="mb-0" style={{ color: "var(--oluxe-gray)", lineHeight: 1.7 }}>
                      {isExpanded.description
                        ? `${product.description.substring(0, 200)}${
                            product.description.length > 200 ? "..." : ""
                          }`
                        : product.description}
                    </p>
                    {product.description.length > 200 && (
                      <button
                        type="button"
                        className="product-page__toggle"
                        onClick={() => handleViewLess("description")}
                      >
                        {isExpanded.description ? (
                          <>
                            Read more <IoIosArrowDown size={15} />
                          </>
                        ) : (
                          <>
                            View less <IoIosArrowUp size={15} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {product.return_policy?.length > 0 && (
                  <div className="product-page__block">
                    <h2 className="product-page__heading">Return Policy</h2>
                    <ul className="product-page__list">
                      {product.return_policy.map((item, index) => {
                        if (!isExpanded.returnPolicy && index >= 3) return null;
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                    {product.return_policy.length > 3 && (
                      <button
                        type="button"
                        className="product-page__toggle"
                        onClick={() => handleViewLess("returnPolicy")}
                      >
                        {isExpanded.returnPolicy ? (
                          <>
                            View more <IoIosArrowDown size={15} />
                          </>
                        ) : (
                          <>
                            View less <IoIosArrowUp size={15} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {product.highlight?.length > 0 && (
                  <div className="product-page__block">
                    <h2 className="product-page__heading">Highlights</h2>
                    <ul className="product-page__list">
                      {product.highlight.map((item, index) => {
                        if (!isExpanded.highlight && index >= 3) return null;
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                    {product.highlight.length > 3 && (
                      <button
                        type="button"
                        className="product-page__toggle"
                        onClick={() => handleViewLess("highlight")}
                      >
                        {isExpanded.highlight ? (
                          <>
                            View more <IoIosArrowDown size={15} />
                          </>
                        ) : (
                          <>
                            View less <IoIosArrowUp size={15} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {specification && (
                  <div className="product-page__block">
                    <h2 className="product-page__heading">Specifications</h2>
                    <table className="product-page__spec-table">
                      <tbody>
                        {Object.entries(specification).map(([key, value], index) => (
                          <tr key={index}>
                            <th>{key}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {product && (
          <section className="product-page__reviews">
            <div className="product-page__container product-reviews">
              <h2 className="product-page__reviews-title">Customer Reviews</h2>
              <ReviewComments product={product} setUpdatepage={setUpdatepage} />
            </div>
          </section>
        )}
      </section>

      {compareProducts?.products?.length > 0 && (
        <ComparePOPup products={compareProducts.products} />
      )}

      <Excusivecategory />
    </>
  );
}

export default Productdetail;
