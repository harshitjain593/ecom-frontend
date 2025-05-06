import React, { useCallback, useState } from "react";
import css from './ordersummary.module.css';
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ChangeAddress = ({ userDetails, setModal, setSelectedAddress ,currentAdress}) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const navigate = useNavigate()
  const handleSettings = ()=>{
    navigate('/profile/address')
  }
  const handleModal = useCallback((address, index) => {
    console.log('handleModal:', address, index);
    setSelectedAddressIndex(index);
    setSelectedAddress(address);
    setModal(false);
  }, [setSelectedAddressIndex, setSelectedAddress, setModal]);

  return (
    <>
      <section className={`position-absolute px-2 py-2 rounded shadow ${css.mainAddress}`}>
         <div className=" d-flex justify-content-between align-items-center py-1 px-4 ">
            <h5>Change your address </h5>
            <div className="d-flex gap-4 ">
             <IoSettingsOutline size={25} onClick={handleSettings} />
             <IoClose size={30} onClick={()=>setModal(false)}/>
            </div>
         </div>
        {userDetails.shipping_address.map((item, index) => (
          <div key={index} className={css.addresscard}>
            <div>
              <input
                onChange={() => handleModal(item, index)}
                checked={currentAdress._id=== item._id}
                type="radio"
                name="shipping_address"
              />
            </div>
            <div>
              <h5>{item.fullName}</h5>
              <h6>{item.mobile}</h6>
              <div className="d-flex justify-content-start text-wrap-wrap">
                <p className="m-0 p-0">{item.billing_address} </p>
                <br /><span>{item.district}</span> , <span>{item.state}</span>,
              <br /> <p> pin:{item.pinCode}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ChangeAddress;
