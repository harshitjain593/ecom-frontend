import React from "react";

const Banner2 = () => {
  return(
    <section 
      className="d-flex banner2-container" 
      style={{
        marginBottom: '.5rem',
        height: '400px',
        maxHeight: '400px',
        minHeight: '400px',
        overflow: 'hidden'
      }}
    >
    <div 
      className="banner2-bg"
      style={{
        height: '400px',
        maxHeight: '400px',
        minHeight: '400px',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
        <div className="banner2-bg-text">
            <img src='/img/after-products-banner-circle1.png' className="banner2-img" alt="" />
            <h3 className="cormorant-italic">Stonemade/Unique.</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis, assumenda?</p>
            {/* <p className='cormorant-italic'>view more <span>	&rarr;</span></p > */}
        </div> 
   </div>   
   <div className="banner2-bg2">

   </div>
    </section>
    
  );
};

export default Banner2;
