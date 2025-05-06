import axios from "axios"
import { API_URL } from "../service/api"

export const contactUsForm = async (form)=>{
    try {
        const response = await fetch(`${API_URL}/mobileApi/contact/contact-us`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(form)
        })
        console.log(response)
        if(response.status ===200){
            const {data:{message}} = response;
            console.log(message)
        }else{
            const err = response.data.message;
            throw Error(err)
        }
    } catch (error) {
        console.log(error);
        
        
    }

}