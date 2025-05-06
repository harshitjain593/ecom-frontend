import React, { useCallback, useEffect, useState } from "react";
import { addNewAdress, deleteAdress} from "../../action/authaction";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosAddCircleOutline, IoIosArrowDropdown } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import { statesData } from "../../action/statesData";
import { GET_DISTRICTS } from "../../action/actionType";

const MangaeAdress = () => {
  const userDeails = useSelector(state=> state.getUser?.user);
  const states = useSelector(state=>state.statesData?.state);
  const districts = useSelector(state=>state.statesData?.districts);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    country: "India",
    state: "",
    city: "",
    district:"",
    pincode: "",
    addressType:''
  });

  useEffect(()=>{
    dispatch(statesData())


  },[])

  const handleChange = (e) => {
    console.log(e.target.name ,'sss')
    if(e.target.name === 'state'){

      dispatch({
        type:GET_DISTRICTS,
        payload:{state:e.target.value}
      })

    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleCancel = () =>{
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      district:"",
      pincode: "",
      addressType:"",
    })
  }
  const handlesubmit = useCallback((e)=>{
    e.preventDefault()
    const body = {
      fullName:formData.fullName,
        billing_address :(formData.addressLine1 +','+ formData.addressLine2),
        email:formData.email,
        mobile:formData.phoneNumber,
        country:formData.country,
        state:formData.state,
        city:formData.city,
        district:formData.district,
        pinCode:formData.pincode,
        addressType:formData.addressType

    }
    dispatch(addNewAdress(body))
  })

  const handleDeleteAddress = useCallback((id)=>{
    dispatch(deleteAdress(id))

  },[dispatch,userDeails])

  useEffect(()=>{
    
  },[userDeails,dispatch])

  return (
    <div className="container-fluid p-0">
    <div className="container">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-lg-center py-3 flex-column flex-lg-row">
        <h2 className="h5 mb-3 mb-lg-0">
          <a href="../../pages/admin/customers.html" className="text-muted">
            <i className="bi bi-arrow-left-square me-2"></i>
          </a>
          Add new Address
        </h2>
      </div>

      {/* Main content */}
      <div className="row">
        {/* Left side */}
        <div className="col-lg-8">
          <form onSubmit={handlesubmit}>
            {/* Basic information */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
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
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
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
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
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
                  </div>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h6 mb-4">Address</h3>
                <div className="mb-3">
                  <label className="form-label">Address Line 1</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <input
                        className="form-control"
                        name="country"
                        value={formData.country}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <div className="position-relative" style={{ width: '100%' }}>
                        <IoIosArrowDropdown size={20} color="black" className="position-absolute" style={{ top: '7px', right: '12px', zIndex: 5, pointerEvents: 'none' }} />
                        <select
                          required
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}>
                          <option value="">Select State</option>
                          {states&&states.map((state, idx) => (
                            <option key={idx} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">District</label>
                      <div className="position-relative" style={{ width: '100%' }}>
                        <IoIosArrowDropdown size={20} color="black" className="position-absolute" style={{ top: '7px', right: '12px', zIndex: 5, pointerEvents: 'none' }} />
                        <select
                          required
                          className="form-control"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}>
                          <option value="">Select District</option>
                           {districts&& districts.map((item,i)=>(
                            <option key={i}  value={item}>{item} </option>
                          ))} 

                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
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
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3 d-flex flex-column justify-content-center align-items-start">
                      <label className="form-label">Address Type</label>
                      <div className="position-relative" style={{ width: '100%' }}>
                        <IoIosArrowDropdown size={20} color="black" className="position-absolute" style={{ top: '7px', right: '12px', zIndex: 5, pointerEvents: 'none' }} />
                        <select
                          required
                          className="form-control"
                          name="addressType"
                          value={formData.addressType}
                          onChange={handleChange}
                          style={{ width: '100%', zIndex: 4, pointerEvents: "auto" }}>
                          <option value="">Select Address Type</option>
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mb-4">
              <button type="submit" className="btn btn-primary me-2">Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
          {/* Right side */}
          <div className="col-lg-4 mt-2 m-lg-0 ">
            {
              userDeails  ? (
                userDeails.shipping_address.length <= 0 ? (
                  <div style={{height:'5rem',width:'100%',textTransform:'uppercase', fontWeight:'500'}}>
                    <h4 className="text-center text-primary">please add new adress</h4>
                    <p className="text-center text-dark" style={{fontWeight:600}}>you have not added any shipping adress</p>
                  </div>

                ):(

                  userDeails.shipping_address.map((item,index)=>{
                    return(
                    <div key={index} className="border  rounded w-full mb-2 py-3 px-3" style={{boxShadow:'1px 1px 1px lightgray',fontSize:'.8rem !important'}}>
                      <div className="d-flex justify-content-between   ">
                      <h4 className="text-secondary text-center">Address-{index+1}</h4>
                      <div className="d-flex gap-2">
                      <Link to={`/profile/updateaddress/${item._id}`}> <CiEdit color="black"  size={25}/></Link>
                      <RiDeleteBin6Line color="red" size={25} onClick={()=>handleDeleteAddress(item._id)}/>
                      </div>
                      </div>
                      <p className="px-2 m-0" style={{ fontWeight: "500", color: "black",fontSize:'.8rem !important' }}>
                        <span style={{color:'brown'}}>Name</span>: {item.fullName}
                      </p>
                      <p className="px-2 m-0" style={{ fontWeight: "500", color: "black",fontSize:'.8rem !important' }}>
                      <span style={{color:'brown'}}>Ph</span>: {item.mobile}
                      </p>
                      <p className="px-2 m-0" style={{ fontWeight: "500", color: "black",fontSize:'.8rem !important' }}>
                      <span style={{color:'brown'}}>Email</span>: {item.email}
                      </p>
                      <p className="m-0 px-2" style={{ fontWeight: "500", color: "black",fontSize:'.8rem !important' }}>
                      <span style={{color:'brown'}}>Address</span>: {item.billing_address}
                      </p>
                      <span className="px-2" style={{ fontWeight: 500, color: "black",fontSize:'.8rem !important' }}><span style={{color:'brown'}}>Pincode</span>: {item.pinCode}</span>
                    </div>
                    )
                  })
                )

              ) : (
                <div>no Address found</div>

              )
            }
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MangaeAdress;
