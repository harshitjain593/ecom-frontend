import { FETCH_DATA_SUCCESS } from '../action/actionType';

const initialState = {
  loading: false,
  data: [],
  error: ''
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: ''
      };
    default:
      return state;
  }
};

export default dataReducer;
