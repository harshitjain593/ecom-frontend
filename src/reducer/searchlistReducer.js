
import { SEARCH_RESULT_LIST } from "../action/actionType";


const initialState = {
    loading:true,
    searchResult:[],
    error:''
}


const SearchResultReducer = (state = initialState,action) => {
   switch (action.type) {
    case SEARCH_RESULT_LIST:
        return {...state, loading:false, searchResult:action.payload }
    default:   
    return state; 
    }
}

export default SearchResultReducer;