import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { getUser, updateProfile } from '../../action/authaction';
import { City, State, Country } from 'country-state-city';
import { GET_DISTRICTS } from '../../action/actionType';
import { statesData } from '../../action/statesData';

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    district: '',
    state: '',
    billing_address: '',
    country: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.getUser?.user);
  const [currentImage, setCurrentImage] = useState(null);
  const [file, setFile] = useState(null); // Keep track of the actual file
  const dispatch = useDispatch();
  const states = useSelector(state=>state.statesData?.state)
  const districts = useSelector(state=>state.statesData?.districts)
  const statesFalgRef = useRef(false)

  useEffect(()=> {
    if(states && !statesFalgRef.current){
      
      dispatch(statesData())
      statesFalgRef.current=true;
    }
    console.log(states,'states')
  },[states,dispatch])


  const toggleEdit = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files.length > 0) {
      const file = files[0];
      setFile(file); // Save the file in state
      setCurrentImage(URL.createObjectURL(file));
    } else {
      if(name==='state'){
        dispatch({
          type:GET_DISTRICTS,
          payload:{state:value}
        })
      }
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (user && !isEditing) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        city: user.city || '',
        district: user.district || '',
        state: user.state || '',
        billing_address: user.billing_address || '',
        country: user.country || '',
        image: user.profile_image || '/img/pottery4.jpg',
      }));
    }
  }, [user, isEditing]);

  const handleSubmit = useCallback(async () => {
    if (isEditing) {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (file) {
        formData.append('image', file); // Append the file
      }

      dispatch(updateProfile(formData));
      setIsEditing(false);
      setCurrentImage(null);
      await dispatch(getUser());
    } else {
      setIsEditing(true);
    }
  }, [isEditing, dispatch, form, file]);

  return user ? (
    <div className="container px-2">
      <h1 className="h3 mb-3">Settings</h1>
      <div className="rows ">
        <div className="col-md-5 col-xl-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Profile Settings</h5>
            </div>
            <div className="list-group list-group-flush" role="tablist">
              <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account" role="tab">
                Account
              </a>
              <Link className='list-group-item list-group-item-action ' to={'/profile/address'}>Shipping Address </Link>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-xl-8">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="account" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Personal info</h5>
                </div>
                <div className="prof-card-body">
                  <form>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="form-grouped d-flex flex-column">
                          <label htmlFor="inputUsername">Username :</label>
                          {isEditing ? (
                            <input
                              name="name"
                              type="text"
                              value={form.name}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          ) : (
                            <span className=' '>{user.name}</span>
                          )}
                        </div>

                        <div className="form-grouped">
                          <label htmlFor="inputEmail4">Email :</label>
                          {isEditing ? (
                            <input
                              type="email"
                              className="form-control"
                              id="inputEmail4"
                              name="email"
                              value={form.email}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{user.email}</span>
                          )}
                        </div>

                        <div className="form-grouped">
                          <label htmlFor="inputMobile">Mobile :</label>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control"
                              id="inputMobile"
                              name="mobile"
                              value={form.mobile}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{user.mobile}</span>
                          )}
                        </div>

                        <div className="form-grouped">
                          <label htmlFor="inputCountry">Country :</label>
                            <span>{user.country}</span>
                        </div>

                        <div className="form-grouped col-md-4">
                          <label htmlFor="inputState">State :</label>
                          {isEditing ? (
                            <select
                              className="form-control"
                              id="inputState"
                              name="state"
                              value={form.state}
                              onChange={(e) => {
                                handleInputChange(e);
                                setForm((prev) => ({ ...prev, city: '' })); // Reset city on state change
                              }}
                            >
                              <option value="">Select State</option>
                              {states.map((state,i) => (
                                <option key={i} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{user.state}</span>
                          )}
                        </div>

                        <div className="form-grouped col-md-6">
                          <label htmlFor="inputCity">City :</label>
                          {isEditing ? (
                            <input
                            type="text"
                            className="form-control"
                            id="inputcity"
                            name="city"
                            value={form.city}
                            onChange={handleInputChange}/>
                             
                            
                          ) : (
                            <span>{user.city}</span>
                          )}
                        </div>

                        <div className="form-grouped">
                          <label htmlFor="inputAddress">Address :</label>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control"
                              id="inputAddress"
                              name="billing_address"
                              value={form.billing_address}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{user.billing_address}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="text-center d-flex justify-content-center flex-column align-items-center">
                          <img
                            alt={user.name}
                            src={currentImage || form.image}
                            className="rounded-circle img-responsive mt-2"
                            width="128"
                            height="128"
                          />
                          {isEditing && (
                            <div className="mt-2 d-flex justify-content-start align-items-center">
                              <label htmlFor="profileImage" style={{ cursor: 'pointer' }}>
                                <span className="btn btn-primary">
                                  <MdOutlineAddAPhoto size={20} /> Upload
                                </span>
                              </label>
                              <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                onChange={handleInputChange}
                                style={{ display: 'none' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={handleSubmit} className="btn btn-primary mt-3">
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="loader"></div>
  );
};

export default Profile;
