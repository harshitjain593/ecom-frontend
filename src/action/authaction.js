import { API_URL } from '../service/api';
import axios from 'axios';
import {
  ADD_NEW_ADDRESS,
  DELETE_ADDRESS,
  GET_PROFILE,
  FORGOT_PASSWORD_SUCCESS,
  UPDATE_ADDRESS,
  FORTGOT_OTP_SUCCESS,
  FORTGOT_OTP_FAILED,
  REGISTER_SUCCESS,
  VERIFIED_FORGOT_PASSWORD,
  REGISTER_FAILED,
} from './actionType';
import { toast } from 'react-toastify';



export const doRegister = (form, callback) => {
  return dispatch => {
    axios.post(`${API_URL}/mobileApi/register`, form)
      .then(response => {
        console.log("res--", response);
        const { data: { message, statusCode } = {} } = response;
        
        if (statusCode === 200) {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data.result,
          });
          toast.success(message);
          if (callback) callback(); // Execute callback if provided
        } else {
          dispatch({
            type: REGISTER_FAILED,
            payload: message,
          });
          toast.error("Registration failed: " + message);
        }
      })
      .catch(error => {
        let errorMessage = "An error occurred during registration.";
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
        dispatch({
          type: REGISTER_FAILED,
          payload: errorMessage,
        });
        toast.error(errorMessage);
      });
  };
};


export const doLogin = (form, callback) => {
  return (dispatch) => {
    axios.post(`${API_URL}/mobileApi/login`, form)
      .then(response => {
         const { data } = response;
        const { message, statusCode } = data;

        if (statusCode === 200) {
          const jwtToken = data.result.user.jwtToken;
          localStorage.setItem('token', jwtToken);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: data.result,
          });
          // toast.success(message);
          if (callback) callback();
        } else {
          toast.error(message);
        }
      })
      .catch(error => {
        if (error.response) {
          const { message } = error.response.data; // Corrected the destructuring of message
          toast.error(message);
        } else {
          toast.error('An unexpected error occurred');
        }
      });
  };
};


export const forgotPassword = (form, callback) => {
  return dispatch => {
    axios.post(`${API_URL}/mobileApi/forget-password`, form)
      .then(response => {
         const { data: { message, statusCode } = {} } = response;
        if (statusCode === 200) {
          dispatch({
            type:  FORGOT_PASSWORD_SUCCESS,
            payload: response.data.result
          });
          // toast.success(message);
          if (callback) callback();
        } else {
          toast.error("Registration failed: " + message);
        }
      })
      .catch(error => {
        if (error.response) {
          const { data: { message } } = error.response;
          toast.error(message);
        } else {
          return error
        }
      });
  };
};


export const updateOtpVerified = (mobile)=>{
  return dispatch => {
    try {

      dispatch({
        type:VERIFIED_FORGOT_PASSWORD,
        payload:{
          mobile:mobile,
          otpVerified:true
        }
      })
      
    } catch (error) {
      
    }
  }
}

export const otpVerification = (form, callback) => {
  return dispatch => {
    axios.post(`${API_URL}/mobileApi/otp-verify`, form)
      .then(response => {
        console.log("res--", response);
        const { data: { message, statusCode } = {} } = response;
        if (statusCode === 200) {
          dispatch({
            type: FORTGOT_OTP_SUCCESS,
            payload: response.data.result
          });
          // toast.success(message);
          if (callback) callback();
        } else {
          toast.error("Registration failed: " + message);
        }
      })
      .catch(error => {
        if (error.response) {
          const { data: { message } } = error.response;
           dispatch({
            type:FORTGOT_OTP_FAILED,
            payload:message
           })
        } else {
          return error
        }
      });
  };
};


export const getUser = () => {
  return async dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      // toast.error('please login');
      return; // Early return if token is not present
    }
    
    try {
      const response = await axios.get(`${API_URL}/mobileApi/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const { statusCode, result} = response.data;
        if (statusCode === 200) {
          dispatch({
            type: GET_PROFILE,
            payload:result
          });
          // toast.success('user details fetched');
        } else {
          
        }
      } else {
        const error = response.data;
        console.log(error);
        
      }
    } catch (error) {
      console.error(error);
      
    }
  };
};

export const addNewAdress = (address)=>{ 
  console.log(address,'this is adress');
  return async dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      // toast.error('please login');
      return; // Early return if token is not present
      }
      try {
        console.log(address,'from add address');
        const response = await fetch(`${API_URL}/mobileApi/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
          shipping_address: address
          })
        });
            if(response.status===200){
              const data = await response.json()
              const {statusCode,result}= data;
              if(statusCode===200){
                dispatch({
                  type:ADD_NEW_ADDRESS,
                  payload:result
                  });
                  console.log(data,'from add new adress')
                  toast.success('new adress added');
                  }
                  else{
                    toast.error('error from add new adress');
                    }
                    }

            }catch(error){
              toast.error('error from add new adress');
              console.log(error,'add new addresss')
            }


  }
}



  export const deleteAdress = (index)=>{
    return async dispatch => {
      const token = localStorage.getItem('token');
      if (!token) {
        // toast.error('please login');
        return; // Early return if token is not present
        }
        try {
          const response =await fetch(`${API_URL}/mobileApi/delete-shipping-address/${index} `,{
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if(response.status===200){
            const data = await response.json()
            const {statusCode,result}= data;
            if(statusCode===200){
              dispatch({
                type:DELETE_ADDRESS,
                payload:result
            })
            console.log('delted address',data);
            toast.success('adress deleted');
          }
        } 
    }catch (error) {
      toast.error('error from delete adress');
      console.log(error,'delete adress')
          
    }

  }
}


export const updateAddress = (index,data)=>{
  return async dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      // toast.error('please login');
      return; // Early return if token is not present
  }
  try {
    console.log(data, 'address from updaet')
    const response = await fetch(`${API_URL}/mobileApi/update-shipping-address/${index}`,{
      method: 'PUT',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
      shippingAddress: data
      })
    })
    if(response.status){
      const data = await response.json();
      const {statusCode,result}= data;
      if(statusCode===200){
        dispatch({
          type:UPDATE_ADDRESS,
          payload:result
        })
        console.log('response',result);
        toast.success('address updated')
      }else{
        throw Error('error while address updation')
      }
    }
    
  } catch (error) {
    toast.error('error from update adress');
    console.log(error,'update adress')
    
  }
}
}

export const updateProfile = (form)=>{
  return async dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('please login')
      return
    }
    try {
      const response = await axios.put(`${API_URL}/mobileApi/profile`, form,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':`Bearer ${token}`
        },
      })

      if(response.status===200){
        const datas = await response.json();
        console.log(datas)
      }else{
        const error = await response.json()
        throw Error(error)
      }
    } catch (error) {
      console.log(error)
      
    }
  }
}