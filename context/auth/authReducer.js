import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    SIGNUP_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_LOADING,
    SET_ALERT,
    CLEAR_ALERT,
    PASSWORD_RESET,
    OTP_SENT,
    OTP_VERIFIED,
    OTP_VERIFY_FAIL,
    OTP_SEND_FAIL,
    EMAIL_VERIFIED,
} from '../types'
import {setCookie, eraseCookie} from '../utils/Cookies'

// eslint-disable-next-line import/no-anonymous-default-export
const authReducer = (state, action) => {
    switch (action.type) {
        case USER_LOADED:
            return {
                ...state,
                ...action.payload,
                token: action.payload.access_token,
                isAuthenticated: true,
                isVerifiedEmail: action.payload.verified_email,
                loading: false,
                user: action.payload,
                refresh: false,
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            }
        case LOGIN_SUCCESS:
            setCookie('user', JSON.stringify(action.payload.data), 86400)
            return {
                ...state,
                ...action.payload,
            }
        case SIGNUP_SUCCESS:
            setCookie('user', JSON.stringify(action.payload.data[0]), 86400)
            return {
                ...state,
                ...action.payload,
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            eraseCookie('user')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                refresh: false,
            }
        case SET_ALERT:
            return {
                ...state,
                alert: {type: action.payload.type, msg: action.payload.msg},
                loading: false,
            }
        case OTP_VERIFIED:
            return {
                ...state,
                loading: false,
            }
        case EMAIL_VERIFIED:
            return {
                ...state,
                isVerifiedEmail: true,
                user: action.payload.data,
                loading: false,
            }
        case PASSWORD_RESET:
            setCookie('user', JSON.stringify(action.payload.data[0]), 86400)
            return {
                ...state,
                ...action.payload,
                loading: false,
            }
        case OTP_SENT:
        case OTP_VERIFY_FAIL:
        case OTP_SEND_FAIL:
            return {
                ...state,
                loading: false,
            }
        case CLEAR_ALERT:
            return {
                ...state,
                alert: null,
            }
        default:
            return state
    }
}

export default authReducer
