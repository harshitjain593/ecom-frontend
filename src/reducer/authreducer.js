import { FORTGOT_OTP_SUCCESS, FORTGOT_OTP_FAILED, FORGOT_PASSWORD_SUCCESS, VERIFIED_FORGOT_PASSWORD} from '../action/actionType';

const initialState = {
  loading: false,
  data: [],
  error: null,
  otpVerified:false,
  mobile:''
};

const authreducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, data: action.payload, error: null };
    case FORTGOT_OTP_FAILED:
      return {...state,error:action.payload}
    case VERIFIED_FORGOT_PASSWORD:
      return{
        ...state,
        otpVerified:action.payload.otpVerified,
        mobile:action.payload.mobile
      }
    default:
      return state;
  }
};

export default authreducer;
