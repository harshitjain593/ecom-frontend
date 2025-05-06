import React, { useEffect, useState } from "react";
import './compPOPup.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { REMOVE_COMPARE_PRODUCTS } from "../../action/actionType";


const ComparePOPup = ({products}) => {
    const [active, setActive] = useState(true);
   const dispatch = useDispatch()
    useEffect(() => {
        const timerId = setTimeout(() => {
            setActive(false);
        }, 5000);

        return () => clearTimeout(timerId);
    }, []); 

    const handleRemove = (product)=>{
        dispatch({
            type: REMOVE_COMPARE_PRODUCTS,
            payload:product
        })
    }

    return (
        <div className={`position-fixed end-0 comp-main-pop-container ${active ?'':'transparent'}`} style={{ bottom: '5rem', right: "3rem", zIndex: 10 }}>
            <div className={`comp-pop-container ${active ? '' : 'stopdisplay'}`}>
                {products && products.map(item=>(
                    <div className="normal-card">
                        <div className="normal-img-container position-relative">
                            <Link to='/compare' className="normal-img-container">
                                <img src={item.productImage} alt="Product" />
                            </Link>
                             <IoMdCloseCircleOutline color="red" className="position-absolute" size={18} onClick={()=>handleRemove(item)}/>
                        </div>
                        <div className="normal-card-text">
                            <span>{item.product_name}</span>
                        </div>
                    </div>
                
                ))}
                
            </div>
            <div className="text-center py-2 mx-2">
                <Link to={'/compare'}>
                   <button className="btn btn-primary">Compare Now</button>
                </Link>
            </div>
        </div>
    );
};

export default ComparePOPup;
