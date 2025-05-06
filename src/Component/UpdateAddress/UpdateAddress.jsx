import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa'; // Importing FontAwesome edit icon
import { updateAddress } from '../../action/authaction';
import { statesData } from '../../action/statesData';
import { GET_DISTRICTS } from '../../action/actionType';

const UpdateAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const address = useSelector((state) => state.getUser?.user?.shipping_address);
  const initialAddress = address && address.filter((item) => item._id === id);
  const dispatch = useDispatch();
  const initialFormData = initialAddress && initialAddress[0];
  const [formData, setFormData] = useState(null);
  const [editField, setEditField] = useState('');
 const states = useSelector(state=>state.statesData?.state)
 const districts = useSelector(state=>state.statesData?.districts)
  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  useEffect(()=>{
    dispatch(statesData())
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==='state'){
      dispatch({
        type: GET_DISTRICTS,
        payload:{state:e.target.value}
      })

    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateAddress(id, formData));
    setEditField('');
    navigate('/profile/address');
  };

  const renderField = useCallback(
    (label, name, type = 'text') => {
      if (name === 'state') {
        return (
          <div className="mb-3">
            <label className="form-label">{label}</label>
            <div className="d-flex align-items-center">
              {editField === name ? (
                <select
                  className="form-control"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {states&&states.map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              ) : (
                <div className="d-flex align-items-center">
                  <p className="mb-0" onClick={() => handleEdit(name)}>{formData[name]}</p>
                  <FaEdit className="ms-2" onClick={() => handleEdit(name)} style={{ cursor: 'pointer' }} />
                </div>
              )}
            </div>
          </div>
        );
      }

      if (name === 'district') {
        return (
          <div className="mb-3">
            <label className="form-label">{label}</label>
            <div className="d-flex align-items-center">
              {editField === name ? (
                <select
                  className="form-control"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                >
                  <option value="">Select District</option>
                  {districts&&districts.map((district, idx) => (
                    <option key={idx} value={district}>{district}</option>
                  ))}
                </select>
              ) : (
                <div className="d-flex align-items-center">
                  <p className="mb-0" onClick={() => handleEdit(name)}>{formData[name]}</p>
                  <FaEdit className="ms-2" onClick={() => handleEdit(name)} style={{ cursor: 'pointer' }} />
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="mb-3">
          <label className="form-label">{label}</label>
          <div className="d-flex align-items-center">
            {editField === name ? (
              <input
                type={type}
                className="form-control"
                name={name}
                disabled={name==='country'}
                value={formData[name]}
                onChange={handleChange}
              />
            ) : (
              <div className="d-flex align-items-center">
                <p className="mb-0" onClick={() => handleEdit(name)}>{formData[name]}</p>
                <FaEdit className="ms-2" onClick={() => handleEdit(name)} style={{ cursor: 'pointer' }} />
              </div>
            )}
          </div>
        </div>
      );
    },
    [editField, formData]
  );

  if (!formData) {
    return <div className="loader"></div>; // Display a loading message until formData is available
  }

  return (
    <div className="mx-5">
      <form className="mt-4" onSubmit={handleSave}>
        {/* Basic information */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                {renderField('Full name', 'fullName')}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                {renderField('Email', 'email', 'email')}
              </div>
              <div className="col-lg-6">
                {renderField('Phone number', 'mobile')}
              </div>
            </div>
          </div>
        </div>
        {/* Address */}
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="h6 mb-4">Address</h3>
            {renderField('Billing Address', 'billing_address')}
            <div className="row">
              <div className="col-lg-6">
                {renderField('Country', 'country')}
              </div>
              <div className="col-lg-6">
                {renderField('State', 'state')}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                {renderField('City', 'city')}
              </div>
              <div className="col-lg-6">
                {renderField('District', 'district')}
              </div>
              <div className="col-lg-6">
                {renderField('Pincode', 'pinCode', 'number')}
              </div>
            </div>
          </div>
        </div>
        <div className="hstack gap-3">
          <button className="btn btn-light btn-sm btn-icon-text" type="button" onClick={() => setEditField('')}>
            <i className="bi bi-x"></i> <span className="text">Cancel</span>
          </button>
          <button className="btn btn-primary btn-sm btn-icon-text" type="submit">
            <i className="bi bi-save"></i> <span className="text">Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAddress;
