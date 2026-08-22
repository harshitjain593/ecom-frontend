import React, { useCallback } from "react";
import { persistSelectedAddress } from "../../utils/orderCheckoutUtils";
import css from "./ordersummary.module.css";
import { IoClose, IoSettingsOutline } from "react-icons/io5";

const ChangeAddress = ({
  userDetails,
  setModal,
  setSelectedAddress,
  currentAdress,
  onAddNew,
}) => {
  const handleModal = useCallback(
    (address) => {
      persistSelectedAddress(address);
      setSelectedAddress(address);
      setModal(false);
    },
    [setSelectedAddress, setModal]
  );

  const addresses = userDetails?.shipping_address || [];

  return (
    <div className={css.modalOverlay} onClick={() => setModal(false)}>
      <section
        className={css.mainAddress}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center py-2 px-4 border-bottom">
          <h5 className="m-0">Change your address</h5>
          <div className="d-flex gap-3 align-items-center">
            <IoSettingsOutline
              size={24}
              onClick={onAddNew}
              style={{ cursor: "pointer" }}
              title="Add new address"
            />
            <IoClose
              size={28}
              onClick={() => setModal(false)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="px-3 pt-2">
          {addresses.length === 0 ? (
            <p className="text-center text-muted py-4">
              No addresses found. Use the settings icon to add one.
            </p>
          ) : (
            addresses.map((item, index) => (
              <div key={item._id || index} className={css.addresscard}>
                <div>
                  <input
                    onChange={() => handleModal(item)}
                    checked={currentAdress?._id === item._id}
                    type="radio"
                    name="shipping_address"
                  />
                </div>
                <div>
                  <h5>{item.fullName}</h5>
                  <h6>{item.mobile}</h6>
                  <div className="d-flex justify-content-start text-wrap-wrap">
                    <p className="m-0 p-0">{item.billing_address}</p>
                    <br />
                    <span>{item.district}</span>, <span>{item.state}</span>,
                    <br />
                    <p>pin: {item.pinCode}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ChangeAddress;
