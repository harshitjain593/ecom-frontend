import React, { useCallback, useEffect, useState } from "react";
import css from "./ordersummary.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdress } from "../../action/authaction";
import { statesData } from "../../action/statesData";
import { GET_DISTRICTS } from "../../action/actionType";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  country: "India",
  state: "",
  city: "",
  district: "",
  pincode: "",
  addressType: "",
};

const AddAddress = ({ setModal, onAddressSaved }) => {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.statesData?.state);
  const districts = useSelector((state) => state.statesData?.districts);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(statesData());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      dispatch({
        type: GET_DISTRICTS,
        payload: { state: value },
      });
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      const body = {
        fullName: formData.fullName,
        billing_address: [formData.addressLine1, formData.addressLine2]
          .filter(Boolean)
          .join(", "),
        email: formData.email,
        mobile: formData.phoneNumber,
        country: formData.country,
        state: formData.state,
        city: formData.city || formData.district,
        district: formData.district,
        pinCode: formData.pincode,
        addressType: formData.addressType,
      };

      const result = await dispatch(addNewAdress(body));
      setSaving(false);

      if (result?.success && result.user?.shipping_address?.length) {
        const addresses = result.user.shipping_address;
        const newAddress = addresses[addresses.length - 1];
        onAddressSaved(newAddress);
        setFormData(initialForm);
      }
    },
    [dispatch, formData, onAddressSaved]
  );

  return (
    <div className={css.modalOverlay} onClick={() => setModal(false)}>
      <section
        className={css.mainAddress}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center py-2 px-4 border-bottom">
          <h5 className="m-0">Add new address</h5>
          <IoClose size={28} onClick={() => setModal(false)} style={{ cursor: "pointer" }} />
        </div>

        <form className="px-4 py-3" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Full name</label>
              <input
                required
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                required
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone number</label>
              <input
                required
                type="text"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address line 1</label>
              <input
                required
                type="text"
                className="form-control"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address line 2</label>
              <input
                type="text"
                className="form-control"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">State</label>
              <div className="position-relative">
                <IoIosArrowDropdown
                  size={20}
                  className="position-absolute"
                  style={{ top: "7px", right: "12px", pointerEvents: "none" }}
                />
                <select
                  required
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  {states?.map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">District</label>
              <div className="position-relative">
                <IoIosArrowDropdown
                  size={20}
                  className="position-absolute"
                  style={{ top: "7px", right: "12px", pointerEvents: "none" }}
                />
                <select
                  required
                  className="form-control"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                >
                  <option value="">Select district</option>
                  {districts?.map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Pincode</label>
              <input
                required
                type="number"
                className="form-control"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Address type</label>
              <select
                required
                className="form-control"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddAddress;
