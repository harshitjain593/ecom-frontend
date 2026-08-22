import React, { useCallback, useEffect, useState } from "react";
import css from "./ordersummary.module.css";
import { checkUser } from "../../assest/js/checker";
import { useDispatch, useSelector } from "react-redux";
import ChangeUser from "./ChangeUser";
import { Link, useNavigate } from "react-router-dom";
import ChangeAddress from "./ChangeAddress";
import AddAddress from "./AddAddress";
import OrderSummaryItem from "./OrderSummaryItem";
import OrderSummaryPricePanel from "./OrderSummaryPricePanel";
import {
  getOrderSummary,
  removeFromOrderSummary,
  updateOrderSummary,
} from "../../action/orderSummaryAction";
import { getUser } from "../../action/authaction";
import DirectForm from "./DirectForm";
import {
  DECREASE_QUANTITY_DIRECTBUY,
  GET_DIRECTBUY,
  INCREASE_QUANTITY_DIRECTBUY,
  REMOVE_QUANTITY_DIRECTBUY,
} from "../../action/actionType";
import {
  formatAddressLine,
  hasOrderItems,
  persistSelectedAddress,
  resolveSelectedAddress,
} from "../../utils/orderCheckoutUtils";

const OrderSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.getUser?.user);
  const isLoggedIn = checkUser();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modal, setModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [quantity, setQuantity] = useState({});
  const [updating, setUpdating] = useState(false);

  const productDetails = useSelector((state) => state.OrderSummary?.data);
  const summaryLoading = useSelector((state) => state.OrderSummary?.loading);
  const directBuy = useSelector((state) => state.directBuy?.data);
  const directAddress = useSelector((state) => state.directBuy?.shipping_address);

  const orderItems = isLoggedIn
    ? productDetails?.orderItems
    : directBuy?.orderItems;
  const priceSummary = isLoggedIn ? productDetails : directBuy;
  const hasItems = hasOrderItems(isLoggedIn ? productDetails : directBuy);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUser());
      dispatch(getOrderSummary());
    } else {
      dispatch({ type: GET_DIRECTBUY });
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (!orderItems?.length) return;

    const quantityPack = {};
    orderItems.forEach((product) => {
      if (product?.colorOptionId) {
        quantityPack[product.colorOptionId] = product.quantity;
      }
    });
    setQuantity(quantityPack);
  }, [orderItems]);

  useEffect(() => {
    const addresses = userDetails?.shipping_address;
    if (!addresses?.length) {
      setSelectedAddress(null);
      return;
    }
    setSelectedAddress(resolveSelectedAddress(addresses));
  }, [userDetails]);

  const handleAddress = useCallback(() => {
    setAddressModal(true);
  }, []);

  const handleOpenAddAddress = useCallback(() => {
    setAddressModal(false);
    setAddAddressModal(true);
  }, []);

  const handleAddressSaved = useCallback((address) => {
    persistSelectedAddress(address);
    setSelectedAddress(address);
    setAddAddressModal(false);
    setAddressModal(false);
  }, []);

  const handleIncreaseQuantity = (productId, colorId, currentQty) => {
    if (!isLoggedIn) {
      setQuantity((state) => ({
        ...state,
        [colorId]: (state[colorId] || 0) + 1,
      }));
      dispatch({
        type: INCREASE_QUANTITY_DIRECTBUY,
        payload: { colorId, quantity: currentQty + 1 },
      });
      return;
    }

    setUpdating(true);
    setQuantity((state) => ({
      ...state,
      [colorId]: (state[colorId] || 0) + 1,
    }));
    dispatch(updateOrderSummary(productId, colorId, currentQty + 1)).finally(
      () => setUpdating(false)
    );
  };

  const handleDecreaseQuantity = (productId, colorId, currentQty) => {
    if (currentQty <= 1) return;

    if (!isLoggedIn) {
      setQuantity((state) => ({
        ...state,
        [colorId]: currentQty - 1,
      }));
      dispatch({
        type: DECREASE_QUANTITY_DIRECTBUY,
        payload: { colorId, quantity: currentQty - 1 },
      });
      return;
    }

    setUpdating(true);
    setQuantity((state) => ({
      ...state,
      [colorId]: currentQty - 1,
    }));
    dispatch(updateOrderSummary(productId, colorId, currentQty - 1)).finally(
      () => setUpdating(false)
    );
  };

  const handleContinue = useCallback(() => {
    if (isLoggedIn && selectedAddress) {
      persistSelectedAddress(selectedAddress);
    }
    navigate("/cart/ordersummary/checkout");
  }, [isLoggedIn, selectedAddress, navigate]);

  const handleRemove = useCallback(
    (productId, colorId) => {
      if (!isLoggedIn) {
        dispatch({
          type: REMOVE_QUANTITY_DIRECTBUY,
          payload: { colorId },
        });
        return;
      }

      setUpdating(true);
      dispatch(removeFromOrderSummary(productId, colorId)).finally(() =>
        setUpdating(false)
      );
    },
    [dispatch, isLoggedIn]
  );

  const renderAddressModals = () =>
    userDetails ? (
      <>
        {modal ? (
          <div className={css.modalOverlay} onClick={() => setModal(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <ChangeUser user={userDetails} setModal={setModal} />
            </div>
          </div>
        ) : null}
        {addressModal ? (
          <ChangeAddress
            userDetails={userDetails}
            setModal={setAddressModal}
            currentAdress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            onAddNew={handleOpenAddAddress}
          />
        ) : null}
        {addAddressModal ? (
          <AddAddress
            setModal={setAddAddressModal}
            onAddressSaved={handleAddressSaved}
          />
        ) : null}
      </>
    ) : null;

  if (!isLoggedIn) {
    return (
      <section className={css.maincontainer}>
        <section className={css.leftcontainer}>
          <div className={css.box}>
            <main>
              <div>
                <p className="text-primary">1</p>
              </div>
              <div className={css.textcontent}>
                <h5>LOGIN</h5>
                <p>Sign in to use your saved addresses and checkout faster.</p>
              </div>
            </main>
            <div className={css.buttonContent}>
              <Link to="/login">Login</Link>
            </div>
          </div>

          <div className="mt-4" style={{ width: "100%" }}>
            <DirectForm />
          </div>

          <div className={css.summarybox}>
            <div>
              <p>3</p>
              <p>Order summary</p>
            </div>
            {hasItems ? (
              orderItems.map((item) => (
                <OrderSummaryItem
                  key={item.colorOptionId || item.product?._id}
                  item={item}
                  quantity={quantity}
                  updating={updating}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={handleRemove}
                />
              ))
            ) : (
              <p className="px-3 py-2 text-muted">No items in your order.</p>
            )}
          </div>

          <div className={css.continueSec}>
            <p>order confirmation will be sent to your mobile number</p>
            {directAddress?.length > 0 && hasItems ? (
              <button type="button" onClick={handleContinue}>continue</button>
            ) : (
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                continue
              </button>
            )}
          </div>
        </section>

        {hasItems && <OrderSummaryPricePanel summary={priceSummary} />}
      </section>
    );
  }

  if (summaryLoading && !hasItems) {
    return (
      <section className={css.maincontainer}>
        <div className="d-flex justify-content-center align-items-center w-100 py-5">
          <div className="loader" />
        </div>
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
            <div className={css.textcontent}>
              <h5>LOGIN</h5>
              <p>
                <span className="flex-nowrap">{userDetails?.name}</span>
                {userDetails?.mobile}
              </p>
            </div>
          </main>
          <div className={css.buttonContent}>
            <button type="button" onClick={() => setModal(true)}>change</button>
          </div>
        </div>

        {selectedAddress ? (
          <div className={css.box}>
            <main>
              <div>
                <p className="text-primary">2</p>
              </div>
              <div className={css.addresscontent}>
                <h5>DELIVERY ADDRESS</h5>
                <p className={css.address}>
                  <span>{selectedAddress.fullName}</span> -
                  <span>{selectedAddress.mobile}</span>,
                  {formatAddressLine(selectedAddress)}
                </p>
              </div>
            </main>
            <div className={css.buttonContent}>
              <button type="button" onClick={handleAddress}>change</button>
            </div>
          </div>
        ) : (
          <div className={css.box}>
            <main>
              <div>
                <p className="text-primary">2</p>
              </div>
              <div className={css.addresscontent}>
                <h5>DELIVERY ADDRESS</h5>
                <p className={`${css.address} text-danger`} style={{ fontWeight: 500 }}>
                  please add address
                </p>
              </div>
            </main>
            <div className={css.buttonContent}>
              <button type="button" onClick={handleOpenAddAddress}>
                Add Address
              </button>
            </div>
          </div>
        )}

        <div className={css.summarybox}>
          <div>
            <p>3</p>
            <p>Order summary</p>
          </div>
          {hasItems ? (
            orderItems.map((item) => (
              <OrderSummaryItem
                key={item.colorOptionId || item.product?._id}
                item={item}
                quantity={quantity}
                updating={updating}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <p className="px-3 py-2 text-muted">
              No items in your order summary.{" "}
              <Link to="/shop">Continue shopping</Link>
            </p>
          )}
        </div>

        <div className={css.continueSec}>
          <p>order confirmation will be sent to registered mobile number</p>
          {selectedAddress && hasItems ? (
            <button type="button" onClick={handleContinue}>continue</button>
          ) : (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              continue
            </button>
          )}
        </div>
      </section>

      {hasItems && <OrderSummaryPricePanel summary={priceSummary} />}
      {renderAddressModals()}
    </section>
  );
};

export default OrderSummary;
