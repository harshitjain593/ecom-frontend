import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {

  const location = useLocation();
  const currentURL = location.pathname;
  if (
    currentURL === '/login' ||
    currentURL === '/register' ||
    currentURL === '/forgot'
  ) {
    return null
  }

  return (
    <>
      <footer className="gi-footer m-t-40">
        <div className="footer-container bg-black">
          <div className="footer-top padding-tb-80">
            <div className="container-fluid">
              <div className="row m-minus-991">
                <div className="col-sm-12 col-lg-3 gi-footer-cat wow fadeInUp">
                  <div className="gi-footer-widget gi-footer-company">
                    <img src="https://harshitj593.s3.eu-north-1.amazonaws.com/colored-logo+(1).png" className="gi-footer-logo" alt="Oluxe footer logo" />
                                          <p className="gi-footer-detail">Oluxe is the biggest market of home decoration products. Get your
                        daily
                      needs from our store.</p>
                    {/* <div className="gi-app-store">
                      <Link to="#" className="app-img"><img src="assets/img/app/android.png" className="adroid"
                        alt="apple" /></Link>
                      <Link to="#" className="app-img"><img src="assets/img/app/apple.png" className="apple"
                        alt="apple" /></Link>
                    </div> */}
                  </div>
                </div>
                <div className="col-sm-12 col-lg-2 gi-footer-info wow fadeInUp" data-wow-delay="0.2s">
                  <div className="gi-footer-widget">
                    <h4 className="gi-footer-heading">Category</h4>
                    <div className="gi-footer-links gi-footer-dropdown">
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link"><Link to="/category/furniture">Furniture</Link></li>
                        <li className="gi-footer-link"><Link to="/category/wooden">Wooden</Link></li>
                        <li className="gi-footer-link"><Link to="/category/ceramic">Ceramic</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-lg-2 gi-footer-account wow fadeInUp" data-wow-delay="0.3s">
                  <div className="gi-footer-widget">
                    <h4 className="gi-footer-heading">Company</h4>
                    <div className="gi-footer-links gi-footer-dropdown">
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link"><a href="#about">About us</a></li>
                        <li className="gi-footer-link"><Link to="/">Delivery</Link></li>
                        <li className="gi-footer-link"><a href="#products">Product</a></li>
                        <li className="gi-footer-link"><Link to="/termsandcondition">Terms & conditions</Link>
                        </li>
                        <li className="gi-footer-link"><Link to="/">Secure payment</Link></li>
                        <li className="gi-footer-link"><Link to="/contact">Contact us</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-lg-2 gi-footer-service wow fadeInUp" data-wow-delay="0.4s">
                  <div className="gi-footer-widget">
                    <h4 className="gi-footer-heading">Account</h4>
                    <div className="gi-footer-links gi-footer-dropdown">
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link"><Link to="/register">Sign In</Link></li>
                        <li className="gi-footer-link"><Link to="/cart">View Cart</Link></li>
                        <li className="gi-footer-link"><Link to="/privacy">Privacy Policy</Link></li>
                        <li className="gi-footer-link"><Link to="/">Become a Vendor</Link></li>
                        <li className="gi-footer-link"><Link to="/">Affiliate Program</Link></li>
                        <li className="gi-footer-link"><Link to="/">Payments</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-lg-3 gi-footer-cont-social wow fadeInUp" data-wow-delay="0.5s">
                  <div className="gi-footer-contact">
                    <div className="gi-footer-widget">
                      <h4 className="gi-footer-heading">Contact</h4>
                      <div className="gi-footer-links gi-footer-dropdown">
                        <ul className="align-itegi-center">
                          <li className="gi-footer-link gi-foo-call">
                            <span className='mt-3'>
                              <i className="fa-solid fa-location-dot"></i>
                            </span>
                            <p>0490D /7/13 main road surajpur greater Noida  Uttar Pradesh.</p>
                          </li>
                          <li className="gi-footer-link gi-foo-call">
                            <span>
                              <i className="fa-brands fa-whatsapp"></i>
                            </span>
                            <Link to="tel:+009876543210">+91 7428689188</Link>
                          </li>
                          <li className="gi-footer-link gi-foo-mail">
                            <span>
                              <i className="fa-regular fa-envelope"></i>
                            </span>
                            <Link to="mailto:example@email.com">shinelure3@gmail.com</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="gi-footer-social">
                    <div className="gi-footer-widget">
                      <div className="gi-footer-links gi-footer-dropdown">
                        <ul className="align-itegi-center">
                          <li className="gi-footer-link"><Link to="#"><i className="fa-brands fa-facebook-f"></i></Link></li>
                          <li className="gi-footer-link"><Link to="#"><i className="fa-brands fa-x-twitter"></i></Link></li>
                          <li className="gi-footer-link"><Link to="#"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                          <li className="gi-footer-link"><Link to="#"><i className="fa-brands fa-instagram"></i></Link></li>
                          <li className="gi-footer-link"><Link to="#"><i className="fa-brands fa-youtube"></i></Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container-fluid">
              <div className="row">
                <div className="gi-copy">Copyright © <Link className="site-name" to="/" style={{ color: "#E1AB0A", fontWeight: "500" }}>Shine Lure </Link>
                  all
                  rights reserved. Designed by  <a className="site-name" href="https://bmdu.net/" style={{ color: "#E1AB0A", fontWeight: "500" }}>BMDU </a>.</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
