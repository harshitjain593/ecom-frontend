import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { doLogin } from '../../../action/authaction';
import { useDispatch } from 'react-redux';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    localStorage.clear()
    e.preventDefault();
    dispatch(doLogin(form, () => {
      const token = localStorage.getItem('token');
      console.log(token, "t---");
      if (token) {
        navigate('/');
      }
    }));
  };

  return (
    <>
      <div className="super-container">
        <div className="rows">
          <div className="intro-section">
            <div className="brand-wrapper d-flex justify-content-sm-center">
             
               <Link className='mx-auto' to={'/'}>
                  <img src="/img/oluxe-logo.png" alt='Oluxe logo' className="auth-logo" />
               </Link> 
            </div>
            <div className="intro-content-wrapper">
              <h1 className="intro-title hh">Welcome to Oluxe!</h1>
              <p className="intro-text">
                Welcome back! Login to access your personalized wishlist and rediscover a world of handcrafted beauty, waiting just for you. Explore the latest creations from our artisans and continue crafting your own unique collection.
              </p>
            </div>
          </div>
          <div className=" form-section">
            <div className="login-wrapper">
              <h2 className="login-title">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="sr-only">Email</label>
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
                <div className="form-group mb-3">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    className="form-control" 
                    placeholder="Password" 
                    value={form.password} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <button type='submit' className='badge bg-warning px-4 py-2 fs-5'>Login</button>
                  <Link to={'/forgot'} className="forgot-password-link">Forgot Password?</Link>
                </div>
                <small className='text-center' style={{ width: '100%' }}>
                  By continuing, you agree to Oluxe's <Link to={'/termsandcondition'}>Terms of Service</Link> and <Link to={'/Privacy'}>Privacy Policy.</Link>
                </small>
              </form>
              <p className="login-wrapper-footer-text mt-2">
                Need an account? <Link  to="/register" className="text-signup">Signup here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
