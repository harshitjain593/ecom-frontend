import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import css from './ordersummary.module.css'

const ChangeUser = ({user,setModal}) => {
    const navigate = useNavigate()
    const handleLogin = useCallback(()=>{
        navigate('/login')
    })
  return (
    <section className={css.changeuserMain} >
        <p className="text-center"  style={{fontWeight:'500', textTransform:'capitalize'}}>are you sure do you want to change the account ?</p>
        <p style={{textTransform:'capitalize'}}>Account : {user.name}</p>
        <div className="d-flex justify-content-between w-full gap-3">
            <button
            onClick={handleLogin}
             className="py-2 px-3 " 
             style={{backgroundColor:'rgb(238, 215, 5)' , color:'black', fontWeight:'bold' ,borderRadius:'5px' }}>yes</button>
            <button className="py-2 px-3 " style={{backgroundColor:'gray' , color:'white', fontWeight:'bold' ,borderRadius:'5px' }}
            onClick={()=>setModal(false)}>cancel</button>
        </div>

    </section>
  );
};

export default ChangeUser;
