import React, { useEffect, useRef, useState } from "react";
import './dbuy.css';
import { IoIosArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ADD_NEW_ADDRESS_DIRECTBUY, GET_DISTRICTS } from "../../action/actionType";
import { statesData } from "../../action/statesData";

const DirectForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    billing_address: "",
    email: "",
    mobile: "",
    country: "India", // Default to India
    state: "",
    city: "",
    district: "",
    pinCode: "",
    addressType: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const states = useSelector(state => state.statesData?.state);
  const districts = useSelector(state => state.statesData?.districts);
  const statesflag = useRef(false);

  // Fetch states data when component mounts
  useEffect(() => {
    if (states && !statesflag.current) {
      dispatch(statesData());
      statesflag.current = true; // Ensure it only runs once
    }
    console.log(states, 'states');
  }, [states, dispatch]);

  // Handle state change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: selectedState,
      district: "" // Reset district when state changes
    }));

    dispatch({
      type: GET_DISTRICTS,
      payload: { state: selectedState }
    });
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData(prev => ({
      ...prev,
      district: selectedDistrict
    }));
  };

  // General handle change for other inputs
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData({
      ...formData,
      [id || name]: value
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.billing_address) newErrors.billing_address = "Billing address is required";
    if (!formData.city && !formData.district) newErrors.city = "City or District is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pinCode) newErrors.pinCode = "Pin Code is required";
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.addressType) newErrors.addressType = "Address type is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShowModal(true);
    } else {
      // Ensure city is populated - use district if city is empty
      // Map addressType to address_type for backend compatibility
      const processedFormData = {
        ...formData,
        city: formData.city || formData.district,
        address_type: formData.addressType
      };
      
      dispatch({
        type: ADD_NEW_ADDRESS_DIRECTBUY,
        payload: processedFormData,
      });
      // setFormData({
      //   fullName: "",
      //   billing_address: "",
      //   email: "",
      //   mobile: "",
      //   country: "India", // Default back to India
      //   state: "",
      //   city: "",
      //   district: "",
      //   pinCode: "",
      //   addressType: "",
      // });
      console.log("Billing Details Submitted:", processedFormData);
      setErrors({});
    }
  };

  return (
    <div className="directContainer">
      <div className="">
        <div className="col-md-12">
          <div className="direct-card">
            <h2 className="d-h2 direct-card-title text-center">Billing Details</h2>
            <div className="card-body py-md-4">
              <form onSubmit={handleSubmit}>
                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group">
                    <input
                      type="text"
                      className="direct-form-control"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                    {errors.fullName && <small className="error">{errors.fullName}</small>}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="direct-form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {errors.email && <small className="error">{errors.email}</small>}
                  </div>
                </div>

                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group">
                    <input
                      type="text"
                      className="direct-form-control"
                      id="billing_address"
                      value={formData.billing_address}
                      onChange={handleChange}
                      placeholder="Billing Address"
                    />
                    {errors.billing_address && <small className="error">{errors.billing_address}</small>}
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label htmlFor="" className="direct-form-label">India</label>
                    {errors.country && <small className="error">{errors.country}</small>}
                  </div>
                </div>

                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group position-relative" style={{ width: '100%' }}>
                    <IoIosArrowDropdown
                      size={23}
                      color="black"
                      className="position-absolute"
                      style={{ top: '20px', right: '12px', zIndex: 5, pointerEvents: 'none' }}
                    />
                    <select
                      id="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      className="direct-form-control d-select"
                      style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}
                    >
                      <option value="">Select State</option>
                      {states.map((state, i) => (
                        <option key={i} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && <small className="error">{errors.state}</small>}
                  </div>
                </div>

                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group position-relative" style={{ width: '100%' }}>
                    <IoIosArrowDropdown
                      size={23}
                      color="black"
                      className="position-absolute"
                      style={{ top: '20px', right: '12px', zIndex: 5, pointerEvents: 'none' }}
                    />
                    <select
                      id="district"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      className="direct-form-control d-select"
                      style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}
                      disabled={formData.state === ''}
                    >
                      <option value="">Select District</option>
                      {districts && districts.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors.district && <small className="error">{errors.district}</small>}
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <input
                      type="text"
                      className="direct-form-control"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    {errors.city && <small className="error">{errors.city}</small>}
                  </div>
                </div>

                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group">
                    <input
                      type="text"
                      className="direct-form-control"
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Pin Code"
                    />
                    {errors.pinCode && <small className="error">{errors.pinCode}</small>}
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      className="direct-form-control"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                    {errors.mobile && <small className="error">{errors.mobile}</small>}
                  </div>
                </div>

                {/* Address Type Dropdown */}
                <div className="main-form-group flex-md-row flex-column gap-2 d-flex justify-content-between">
                  <div className="form-group position-relative" style={{ width: '100%' }}>
                    <IoIosArrowDropdown
                      size={23}
                      color="black"
                      className="position-absolute"
                      style={{ top: '20px', right: '12px', zIndex: 5, pointerEvents: 'none' }}
                    />
                    <select
                      id="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      className="direct-form-control d-select"
                      style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}
                    >
                      <option value="">Select Address Type</option>
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                    </select>
                    {errors.addressType && <small className="error">{errors.addressType}</small>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectForm;
