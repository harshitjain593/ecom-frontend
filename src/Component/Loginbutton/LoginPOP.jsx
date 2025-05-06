import React, { useCallback, useEffect, useState } from "react";
import './popup.css';
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { checkUser } from "../../assest/js/checker";

const LoginPOP = () => {
  const [modal, setModal] = useState(checkUser());
  const navigate = useNavigate()

  const handleNavigate = useCallback(()=>{
    navigate('/login')
  })
  
  // Add an empty dependency array to ensure it runs once on mount

  return (
    <>
      <main className={!modal ? 'popmain ' : 'd-none' }>
        <section className="d-flex mx-auto ">
          <IoMdClose   className="position-absolute xclose "  onClick={()=>setModal(true)}/>
          <div className="popchild1">
            <h1 className="text-start" >Login</h1>
            <p className="text-primary" >Get access to your Orders, Wishlist and Recommendations</p>
             <div className="d-flex " >
              <img src="/img/popupbg.png" alt="" />
             </div>
          </div>
          <div className="justify-content center align-items-center bgfordiv  ">
            <div className="d-flex flex-column ">
              <p className="text-light" >Explore more by Logging In </p>
              <button className="rounded"
              onClick={handleNavigate}>Login</button>
            </div>
            <div className="text-center linkbox "> 
              <Link to={'/register'} className="rounded alink ">
              New to shine Decoration? Create an account
              </Link>
            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPOP;
