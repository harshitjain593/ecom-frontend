import { GET_CATEGORY } from '../action/actionType';

const initialState = {
  loading: true,
  data: [],
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY:
      return(

         { ...state, categories: action.payload,loading:false });
    default:
      return state;
  }
};

export default categoryReducer;