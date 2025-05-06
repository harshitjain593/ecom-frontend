import axios from "axios";
import { API_URL } from "../service/api"

export const sendReview = async(productId,form)=>{
    
    console.log(form,"this is from")
        const token = localStorage.getItem('token')
        if(!token){
            console.log('please login');
            return
        }
    
       try {
        const response = await axios.post(`${API_URL}/mobileApi/review/add-review/${productId}`,form, {         
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',

            },
          
        });
               if( response.status=== 200){
                
                console.log(response,'success reveiew sent');
                return true
               }else{
                console.log(response,'failed reveiew sent')
                return false
               }
       } catch (error) {
        console.log(error)
        
       }

  

}


export const addLikesandDislikes = async(productId,form) => {
    console.log(form,"form hai")
    const token = localStorage.getItem('token')
    try {
        const response = await fetch(`${API_URL}/mobileApi/review/review/${productId}`,{
            method:'PUT',
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body:JSON.stringify(form)
        })
        if(response.statusi===200){
            const datas = await response.json()
            const {data:{message,result}}= datas;
            console.log(response,'check uupddaate like')
        }else{
            throw Error(response)
        }
    } catch (error) {
        console.log(error)
        
    }

}