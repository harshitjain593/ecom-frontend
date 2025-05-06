import React from "react";
import './checkuser.css';

export function CheckUserComponent({children}) {
  return(
          <section className="check-main-container">
              <div className="d-flex justify-content-center">
                  <img src="/img/cart-not-login.webp" alt="" />
              </div>
              
              {children}
        </section>
        );
        
}
  