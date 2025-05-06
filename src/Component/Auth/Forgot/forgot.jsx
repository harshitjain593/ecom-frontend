import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, updateOtpVerified } from '../../../action/authaction';
import { registerVerifyOtp } from '../../../action/RegisterationAction';
import './register.css';
import { LuPhone } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({});
  const [inputError, setInputError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpExpiry, setOtpExpiry] = useState(30);
  const dispatch = useDispatch();
  const otpRefs = useRef([]);
  const intervalId = useRef(null);
  const forgotPasswordOtp = useSelector(state => state.forgotPasswordData?.data?.otp);
  const navigate = useNavigate()

  useEffect(() => {
    if (otpSent && !intervalId.current) {
      intervalId.current = setInterval(() => {
        setOtpExpiry(prev => {
          if (prev <= 1) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [otpSent]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (otpSent) {
      const otpValue = otp.join('');
      if (Number(otpValue) === forgotPasswordOtp && forgotPasswordOtp) {
        const updatedForm = { ...form, otp: Number(otpValue) };
        setForm(updatedForm);
        try {
          const response = await registerVerifyOtp(updatedForm);
          if(response.status){
             dispatch(updateOtpVerified(form.mobile))
             navigate('/resetpassword')
          }
          // Handle success or failure response
          setOtpSent(false);
          setOtp(new Array(6).fill(''));
          setOtpExpiry(30);
        } catch (err) {
          
        }
      } else {
        setInputError('OTP is not matching');
      }
    } else {
      if (form.mobile?.length === 10 && !isNaN(Number(form.mobile))) {
        setInputError('');
        dispatch(forgotPassword(form, () => {
          setOtpSent(true);
          setOtpExpiry(30);
        }));
      } else {
        setInputError('Please enter a valid mobile number');
      }
    }
  }, [otpSent, dispatch, form, otp, forgotPasswordOtp]);

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResendOtp = useCallback((e) => {
    e.preventDefault();
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    setOtp(new Array(6).fill(''));
    setOtpExpiry(30);
    setInputError('');
    dispatch(forgotPassword(form, () => {
      setOtpSent(true);
    }));
  }, [dispatch, form]);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '420px', borderRadius: '10px' }}>
        <div className="text-center">
          <h3><i className="fa fa-lock fa-4x"></i></h3>
          <h2 className="text-center mb-4">Forgot Password?</h2>
          <p>You can reset your password here.</p>
          <div className="panel-body">
            {!otpSent ? (
              <form onSubmit={handleSubmit} id="register-form" autoComplete="off" className="d-flex flex-column justify-content-center align-items-center gap-2">
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon mx-3"><LuPhone size={24} color='black'/></span>
                    <input
                      id="mobile"
                      name="mobile"
                      placeholder="mobile number"
                      className="form-control"
                      type="tel"
                      value={form.mobile || ''}
                      onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      onBlur={() => setInputError('')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="" className='text-danger'>{inputError}</label>
                </div>
                <button type="submit" className="btn btn-lg btn-warning btn-block">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} id="otp-form" autoComplete="off" className="d-flex flex-column justify-content-center align-items-center gap-0 otp-form">
                <div className="title text-black">
                  <h3>OTP VERIFICATION</h3>
                  <p className="text-primary">An OTP has been sent to your Mobile Number</p>
                  <p className="msg">Please enter OTP to verify</p>
                </div>
                <div className="otp-input-fields">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      className={`otp__digit otp__field__${index + 1}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => otpRefs.current[index] = el}
                      maxLength={1}
                    />
                  ))}
                </div>
                <div>
                  <label htmlFor="">The OTP will expire in {otpExpiry} seconds</label>
                  <label htmlFor="" className='text-danger pt-1'>{inputError}</label>
                </div>
                {otpExpiry === 0 ? (
                  <button onClick={handleResendOtp} className="btn btn-lg btn-warning btn-block mt-2">Resend OTP</button>
                ) : (
                  <button type="submit" className="btn btn-lg btn-warning btn-block mt-2">Verify OTP</button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
