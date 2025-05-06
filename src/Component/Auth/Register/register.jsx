import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useDispatch, useSelector } from "react-redux";
import { doRegister } from "../../../action/authaction";
import Modal from "../../modals/Modal";
import { registerVerifyMobile, registerVerifyOtp } from "../../../action/RegisterationAction";

function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
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
    if (!form.mobile) newErrors.mobile = "Mobile number is required";
    else if (form.mobile.length !== 10) newErrors.mobile = "Mobile number is invalid";

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
        removableProps.forEach((prop) => delete form[prop]);
        setOtpVerify(true);
        handleTimer();
        dispatch(registerVerifyMobile({ mobile: form.mobile }));
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
                    mobile: Number(form.mobile),
                    otp: Number(otp.join(''))
                });
                
                if (response.status) {
                    dispatch(doRegister(form, () => {
                      if(token){
                        localStorage.setItem('token',token)
                        navigate('/')
                      }
                       
                    }));
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
      dispatch(registerVerifyMobile({ mobile: form.mobile }));
      handleTimer();
    }
  }, [otpVerify, timer, form.mobile, handleTimer, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="main-container">
        {!otpVerify ? (
          <form className="form" onSubmit={handleSubmit} autoComplete="true">
            <img
              src="/img/shinedecoration-logo.png"
              alt=""
              style={{ objectFit: "contain", height: "3rem", margin: "0" }}
            />
            <div className="title">Welcome</div>
            <div className="subtitle">Let's create your account!</div>
            <div className="input-container ic1">
              <input
                required
                id="name"
                className="input"
                name="name"
                onChange={handleInputChange}
                value={form.name}
                type="text"
                placeholder=" "
              />
              <label htmlFor="name" className="placeholder">
                Full name
              </label>
            </div>
            <div className="input-container ic2">
              <input
                required
                id="mobile"
                className="input"
                type="tel"
                name="mobile"
                placeholder=" "
                onChange={handleInputChange}
                value={form.mobile}
              />
              <label htmlFor="mobile" className="placeholder">
                Mobile number
              </label>
            </div>
            <div className="input-container ic2">
              <input
                required
                id="password"
                className="input"
                name="password"
                autoComplete="true"
                type="password"
                onChange={handleInputChange}
                value={form.password}
                placeholder=" "
              />
              <label htmlFor="password" className="placeholder">
                Password
              </label>
            </div>
            <div className="input-container ic2">
              <input
                required
                id="repeatPassword"
                autoComplete="true"
                className="input"
                name="repeatPassword"
                type="password"
                onChange={handleInputChange}
                value={form.repeatPassword}
                placeholder=" "
              />
              <label htmlFor="repeatPassword" className="placeholder">
                Confirm Password
              </label>
            </div>
            <div className="input-check">
              <input
                required
                className="checkbox"
                name="agreeTerms"
                type="checkbox"
                onChange={handleInputChange}
                value={form.agreeTerms}
                placeholder=" "
              />
              <p>
                By continuing, you agree to Shine Decoration's{" "}
                <Link to="#">Terms of Service</Link> and{" "}
                <Link to="#">Privacy Policy.</Link>
              </p>
            </div>
            <button type="submit" className="submit">
              Send OTP
            </button>
          </form>
        ) : (
          <form
            autoComplete="true"
            onSubmit={handleOtpVerification}
            className="form d-flex flex-column justify-content-center align-items-center gap-2"
          >
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
              <label className="text-warning">Enter OTP</label>
              <div className="d-flex gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    style={{ width: "40px" }}
                    value={digit}
                    ref={(el) => (otpRef.current[index] = el)}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength={1}
                    onKeyDown={(e) => handleOtpKey(e, index)}
                    type="text"
                  />
                ))}
              </div>
            </div>
            <div className=" text-secondary px-1">
              <p>The OTP will expire in <span className="text-warning m-0">{timer}</span> seconds</p>
            </div>
            {otpExpired ? (
              <button onClick={handleResendOtp} className="btn btn-warning">
                Resend OTP
              </button>
            ) : (
              <button type="submit" className="btn btn-warning">
                Submit
              </button>
            )}
            {otpError.length > 0 ? (
              <div className="d-flex justify-content-center align-items-center text-danger ">
                <ul className="d-flex justify-content-center align-items-center">
                  {otpError.map((item, index) => (
                    <li key={index} className="text-danger px-2" style={{ fontSize: '.8rem', listStyle: 'disc' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              ''
            )}
          </form>
        )}

        <Modal show={showModal} handleClose={handleCloseModal}>
          <ul className="modal-ul list-group list-group-flush">
            {Object.values(errors).map((error, index) => (
              <li className="list-group-item fs-5" key={index}>
                {error}
              </li>
            ))}
          </ul>
        </Modal>
      </section>
    </>
  );
}

export default Register;
