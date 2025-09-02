import React from "react";

const Banner3 = () => {
  return (
    <section 
      className="banner3-container d-flex justify-content-center align-items-start"
      style={{
        height: '300px',
        maxHeight: '300px',
        minHeight: '300px',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
        <div className="text-center position-relative">
            <div className="text-overlay">
                <p className="">Don't be afraid to create your own style and your own rules, your own pottery.</p>
                {/* <p>view more <span>&rarr;</span></p> */}
            </div>
        </div>
    </section>
  )
}

export default Banner3;
