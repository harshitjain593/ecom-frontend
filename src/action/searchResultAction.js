import { toast } from "react-toastify"
import { SEARCH_RESULT_LIST } from "./actionType"




export const getSearchResult = (ResultArray) => {
    return dispatch => {
        try {
            if(!ResultArray) {
                return  
            }
            dispatch({
                type: SEARCH_RESULT_LIST,
                payload: ResultArray
            })
            // toast.success('search result got dispatched successfully')
            
        } catch (error) {
            toast.error(error)
            console.log(error)     
        }

    }
}