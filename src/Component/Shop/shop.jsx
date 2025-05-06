import React, { useState } from 'react';
import Shopproduct from './Shopproduct';
import Shoppro from './Shoppro';
import './shop.css'
import { useSearchParams } from 'react-router-dom';

function Shop() {

  const [isOpen, setIsOpen] = useState({});
  const [isMaterial, setIsMaterial] = useState({});
  const [isdiscount, setIsdiscount] = useState({});

  const toggleCategory = () => {
    setIsOpen(!isOpen);
  };

  const togglematerial = () => {
    setIsMaterial(!isMaterial)
  }
  const togglediscount = () => {
    setIsdiscount(!isdiscount)
  }
  return (
    <>
      <section className='container-fluid py-2'>
        <div className="row">
          <div className="col-lg-2 pt-4 bg-white">
            <div className='position-sticky top-0'>
              <div className='pt-3'>
                <div onClick={toggleCategory} className="d-flex justify-content-between">
                  <h6 style={{ fontSize: "12px" }}>CATEGORIES</h6>
                  <span style={{ fontSize: "12px" }}> <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i></span>
                </div>
                {isOpen && (
                  <div>
                    <div className="search-box">
                      <input type="text" placeholder="Search..." style={{ height: "30px" }} className='w-100' />
                      <button type="submit" style={{ fontSize: "12px" }}><i className="fa-solid fa-magnifying-glass text-black"></i></button>
                    </div>
                    <div className='p-2'>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Bone China" value="This is an inbox layout" />
                        <label htmlFor="Bone China" className='px-2' style={{ fontSize: "15px" }}>Bone China</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Wooden" value="This is an inbox layout" />
                        <label htmlFor="Wooden" className='px-2' style={{ fontSize: "15px" }}>Wooden</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Ceramic" value="This is an inbox layout" />
                        <label htmlFor="Ceramic" className='px-2' style={{ fontSize: "15px" }}>Ceramic</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='pt-3'>
                <div onClick={togglematerial} className="d-flex justify-content-between">
                  <h6 style={{ fontSize: "12px" }}>MATERIAL</h6>
                  <span style={{ fontSize: "12px" }}> <i className={`fa-solid ${isMaterial ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i></span>
                </div>
                {isMaterial && (
                  <>
                    <div className="search-box">
                      <input type="text" placeholder="Search..." style={{ height: "30px" }} className='w-100' />
                      <button type="submit" style={{ fontSize: "12px" }}><i className="fa-solid fa-magnifying-glass text-black"></i></button>
                    </div>
                    <div className='p-2'>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Metal" value="This is an inbox layout" />
                        <label for="Metal" className='px-2' style={{ fontSize: "15px" }}>Metal</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Glass" value="This is an inbox layout" />
                        <label for="Glass" className='px-2' style={{ fontSize: "15px" }}>Glass</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="PVC" value="This is an inbox layout" />
                        <label for="PVC" className='px-2' style={{ fontSize: "15px" }}>PVC</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Resin" value="This is an inbox layout" />
                        <label for="Resin" className='px-2' style={{ fontSize: "15px" }}>Resin</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Jute" value="This is an inbox layout" />
                        <label for="Jute" className='px-2' style={{ fontSize: "15px" }}>Jute</label>
                      </div>
                      <div className="input-group">
                        <input type="checkbox" name="options" id="Ceramic" value="This is an inbox layout" />
                        <label for="Ceramic" className='px-2' style={{ fontSize: "15px" }}>Ceramic</label>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className='pt-3'>
                <div onClick={togglediscount} className="d-flex justify-content-between">
                  <h6 style={{ fontSize: "12px" }}>DISCOUNT</h6>
                  <span style={{ fontSize: "12px" }}> <i className={`fa-solid ${isdiscount ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i></span>
                </div>
                {
                  isdiscount && (
                    <>
                      <div className="search-box">
                        <input type="text" placeholder="Search..." style={{ height: "30px" }} className='w-100' />
                        <button type="submit" style={{ fontSize: "12px" }}><i className="fa-solid fa-magnifying-glass text-black"></i></button>
                      </div>
                      <div className='p-2'>
                        <div className="input-group">
                          <input type="checkbox" name="options" id="10% & above" value="This is an inbox layout" />
                          <label for="10% & above" className='px-2' style={{ fontSize: "15px" }}>
                            10% & above
                          </label>
                        </div>
                        <div className="input-group">
                          <input type="checkbox" name="options" id="20% & above" value="This is an inbox layout" />
                          <label for="20% & above" className='px-2' style={{ fontSize: "15px" }}>20% & above</label>
                        </div>
                        <div className="input-group">
                          <input type="checkbox" name="options" id="30% & above" value="This is an inbox layout" />
                          <label for="30% & above" className='px-2' style={{ fontSize: "15px" }}>30% & above</label>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </div>
          <div className="col-lg-10">
            <div className="container my-5">
              <div className="row">
                {/* <!-- Product Card 1 --> */}
                <div className="col-md-3">
                  <div className="card mb-4">
                    <img src="/img/Rectangle 128.png" className="card-img-top" alt="Car" />
                    <div className="p-2">
                      <h6 className="card-title" style={{ fontSize: "13px" }}>CADDLE & TOES Famous Car Remote Control 3D with LED Lights</h6>
                      <p className="card-text">
                        <div className="">
                          <span>(9,824)</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <span className="text-success font-weight-bold" style={{ fontWeight: "600" }}>₹499</span>
                          <span className="text-muted px-2" style={{ fontWeight: "600" }}><s>₹1,999</s></span>
                          <span className="badge text-dark">75% off</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <span className="ml-2 px-2" style={{ fontWeight: "600" }}>3.5 Star</span>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
                <Shoppro />
              </div>
            </div>
            {/* <div style={{ paddingTop: "32px" }}>
              <Shopproduct />
            </div>
            <Shopproduct /> */}
          </div>
        </div>
      </section>
    </>
  )
}
export default Shop;
