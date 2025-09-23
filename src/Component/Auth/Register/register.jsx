import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useDispatch, useSelector } from "react-redux";
import { doRegister } from "../../../action/authaction";
import Modal from "../../modals/Modal";
import { registerVerifyEmail, registerVerifyOtp } from "../../../action/RegisterationAction";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeTerms: false,
  });
  const [otpError, setOtpError] = useState([]);
  const [otpVerify, setOtpVerify] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerOtp = useSelector((state) => state.registerVerify?.data?.otp);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRef = useRef([]);
  const [timer, setTimer] = useState(30);
  const registerError = useSelector(state=>state.registeredUser?.error);
  const token = useSelector(state=>state.registeredUser?.data?.token);

  useEffect(()=>{
    if(registerError){
      setOtpVerify(false)
      setErrors(prev=>({error:String((registerError))}))
      setShowModal(true)
    }
    setErrors({})
    setShowModal(false)
    if(token){
      localStorage.setItem('token',token);
      navigate('/')
    }
  },[registerError,token,dispatch])

  const validateForm = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (form.password !== form.repeatPassword) newErrors.repeatPassword = "Passwords do not match";

    if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleOtpKey = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (index > 0) {
        otpRef.current[index - 1].focus();
      }
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        otpRef.current[index + 1].focus();
      }
    } else if (e.keyCode === 8 && index > 0) {
      console.log('backspace')
      otpRef.current[index - 1].focus();
    }
  };

  const handleTimer = useCallback(() => {
    if (otpVerify) {
      const intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(intervalId);
            setOtpExpired(true); // Set OTP expired to true
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setTimer(30);
    }
  }, [otpVerify]);

  useEffect(() => {
    const cleanup = handleTimer();
    return cleanup;
  }, [handleTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerify) {
      setShowModal(false)
      const formErrors = validateForm();
      if (Object.keys(formErrors).length === 0) {
        const removableProps = ["repeatPassword", "agreeTerms"];
        const formData = { ...form };
        removableProps.forEach((prop) => delete formData[prop]);
        setOtpVerify(true);
        handleTimer();
        dispatch(registerVerifyEmail(formData));
      } else {
        setErrors(formErrors);
        setShowModal(true);
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpError([]);
    
    const unFilledOtp = otp.every(item => item !== '');
    if (otpVerify && timer > 0) {
           if (otp.length === 0) {
            setOtpError(['Please enter OTP']);
            return;
        }
        if (!unFilledOtp) {
            setOtpError(['Please fill in all fields']);
            return;
        }
        
        if (Number(otp.join('')) === Number(registerOtp)) {
            try {
                const response = await registerVerifyOtp({
                    email: form.email,
                    otp: Number(otp.join(''))
                });
                
                if (response.status) {
                    // Store the token from the response
                    if (response.result && response.result.token) {
                        localStorage.setItem('token', response.result.token);
                        navigate('/');
                    } else {
                        // Fallback to doRegister if needed
                        dispatch(doRegister(form, () => {
                            if(token){
                                localStorage.setItem('token',token)
                                navigate('/')
                            }
                        }));
                    }
                } else {
                    console.log('OTP verification failed');
                    setOtpError([response.message]);
                }
            } catch (error) {
                console.error('Error during OTP verification:', error);
                setOtpError(['An error occurred during verification. Please try again.']);
            }
        } else {
            setOtp(new Array(6).fill(""));
            setOtpError(['OTP is not matching, please try again']);
        }
    } else {
        setOtpError(['OTP verification not allowed at this time.']);
    }
};

  const handleResendOtp = useCallback(() => {
    setOtpError([]);
    if (otpVerify && timer === 0) {
      setOtp(new Array(6).fill(""));
      setOtpExpired(false);
      setTimer(30);
      dispatch(registerVerifyEmail({ email: form.email }));
      handleTimer();
    }
  }, [otpVerify, timer, form.email, handleTimer, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="super-container">
        <div className="rows">
          <div className="intro-section">
            <div className="brand-wrapper d-flex justify-content-sm-center">
              <Link className='mx-auto' to={'/'}>
                <img src="https://harshitj593.s3.eu-north-1.amazonaws.com/colored-logo+(1).png" alt='Oluxe logo' />
              </Link> 
            </div>
            <div className="intro-content-wrapper">
              <h1 className="intro-title hh">Welcome to Oluxe!</h1>
              <p className="intro-text">
                Join our community of art lovers! Create your account to discover handcrafted treasures, save your favorites, and enjoy a personalized shopping experience tailored just for you.
              </p>
            </div>
          </div>
          <div className="form-section">
            {!otpVerify ? (
              <div className="login-wrapper">
                <h2 className="login-title">Create Account</h2>
                <form onSubmit={handleSubmit} autoComplete="true">
                  <div className="form-group">
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="form-control" 
                      placeholder="Full Name" 
                      value={form.name} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="sr-only">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="form-control" 
                      placeholder="Email Address" 
                      value={form.email} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      className="form-control" 
                      placeholder="Password" 
                      value={form.password} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="repeatPassword" className="sr-only">Confirm Password</label>
                    <input 
                      type="password" 
                      name="repeatPassword" 
                      id="repeatPassword" 
                      className="form-control" 
                      placeholder="Confirm Password" 
                      value={form.repeatPassword} 
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <div className="d-flex align-items-start gap-2">
                      <input
                        required
                        className="form-check-input mt-1"
                        name="agreeTerms"
                        type="checkbox"
                        onChange={handleInputChange}
                        checked={form.agreeTerms}
                      />
                      <small className="text-muted">
                        By continuing, you agree to Oluxe's{" "}
                        <Link to="/termsandcondition">Terms of Service</Link> and{" "}
                        <Link to="/Privacy">Privacy Policy.</Link>
                      </small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mb-4">
                    <button type="submit" className="login-btn">
                      Send OTP
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="login-wrapper">
                <h2 className="login-title">Verify OTP</h2>
                <form autoComplete="true" onSubmit={handleOtpVerification}>
                  <div className="form-group text-center">
                    <label className="form-label mb-3">Enter the 6-digit OTP sent to your email</label>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          className="otp-input"
                          value={digit}
                          ref={(el) => (otpRef.current[index] = el)}
                          onChange={(e) => handleOtpChange(e, index)}
                          maxLength={1}
                          onKeyDown={(e) => handleOtpKey(e, index)}
                          type="text"
                        />
                      ))}
                    </div>
                    <div className="text-center mb-4">
                      <small className="text-muted">
                        OTP will expire in <span className="text-warning fw-bold">{timer}</span> seconds
                      </small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mb-4">
                    {otpExpired ? (
                      <button type="button" onClick={handleResendOtp} className="login-btn">
                        Resend OTP
                      </button>
                    ) : (
                      <button type="submit" className="login-btn">
                        Verify OTP
                      </button>
                    )}
                  </div>
                  {otpError.length > 0 && (
                    <div className="text-center">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {otpError.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} handleClose={handleCloseModal}>
        <ul className="modal-ul list-group list-group-flush">
          {Object.values(errors).map((error, index) => (
            <li className="list-group-item fs-5" key={index}>
              {error}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}

export default Register;
