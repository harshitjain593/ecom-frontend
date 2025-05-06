import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { CLEAR_ERROR } from "../../action/actionType";
import useLocal from "../../service/compare";

const CompareError = ({error}) => {
    const [timeOutId, setTimeoutId] = useState(null)
    const [local , setLocal ,localError] = useLocal({
        category:'',
        products:[]
    })
    const errorREf = useRef()
    const dispatch = useDispatch()
    useEffect(()=>{
        if(error!=='' || error){
           const timeid = setTimeout(() => {

                errorREf.current.classList.add('d-none')
            }, 2000);
            setTimeoutId(prev=>timeid)
            
        }
        return ()=> {clearTimeout(timeOutId)
            errorREf.current.classList.remove('d-none')
           
        }
        
    },[error])
  return (<div ref={errorREf} className="bg-danger text-white position-fixed compare-error px-2 py-1 rounded" >
    {error}
    </div>);
};

export default CompareError;
