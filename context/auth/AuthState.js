import React, {useReducer} from 'react'
import axios from 'axios'
import AuthContext from './authContext'
import authReducer from './authReducer'
import setDefaultHeaders from '../utils/defaultHeaders'

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
    OTP_SENT,
    OTP_VERIFIED,
    OTP_VERIFY_FAIL,
    OTP_SEND_FAIL,
    PASSWORD_RESET,
    EMAIL_VERIFIED,
} from '../types'
import {getCookie} from '../utils/Cookies'

const AuthState = props => {
    const initialState = {
        token: null,
        isAuthenticated: false,
        isVerifiedEmail: false,
        loading: false,
        user: null,
        alert: null,
        refresh: true,
    }

    const [state, dispatch] = useReducer(authReducer, initialState)

    //Load User
    const loadUser = async () => {
        const user = JSON.parse(getCookie('user'))
        setDefaultHeaders(user)
        if (user)
            dispatch({
                type: USER_LOADED,
                payload: user,
            })
        else {
            dispatch({
                type: AUTH_ERROR,
            })
        }
    }

    //Load user on first run or refresh
    if (state.refresh) {
        if (typeof window === 'object') {
            loadUser()
        }
    }

    //Loading
    const setLoading = async () => {
        dispatch({type: SET_LOADING})
    }

    //Update Last Login
    const updateLastLogin = async user => {
        setLoading()
        const headers = {
            user: user,
        }
        try {
            const res = await axios.post(
                '/api/account/updatelastlogin',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('last login updated', res.data)
            } else {
                console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    //Login a User
    const login = async formData => {
        setLoading()
        const headers = {
            user: formData.user,
            password: formData.password,
        }
        try {
            const res = await axios.post('/api/auth/signin', {}, {headers})
            if (res.data.code == 'SUCCESS') {
                console.log('login success', res.data)
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data,
                })
                updateLastLogin(formData.user)
                loadUser()
            } else {
                console.log(res.data)
                setAlert('Error', res.data.code)
                dispatch({
                    type: LOGIN_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log(error)
            dispatch({
                type: LOGIN_FAIL,
                payload: error,
            })
        }
    }

    //Signup a User
    const signup = async formData => {
        setLoading()
        const headers = {
            username: formData.user,
            password: formData.password,
            email: formData.email,
        }
        try {
            const res = await axios.post('/api/auth/signup', {}, {headers})
            if (res.data.code == 'SUCCESS') {
                console.log('Register success', res.data)
                dispatch({
                    type: SIGNUP_SUCCESS,
                    payload: res.data,
                })
                updateLastLogin(formData.user)
                loadUser()
            } else {
                console.log(res.data)
                setAlert('Error', res.data.code)
                dispatch({
                    type: LOGIN_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            dispatch({
                type: LOGIN_FAIL,
                payload: error,
            })
        }
    }

    //Send OTP
    const sendOTP = async email => {
        setLoading()
        const headers = {
            email,
        }
        try {
            const res = await axios.post('/api/auth/sendotp', {}, {headers})
            if (res.data.code == 'SUCCESS') {
                console.log('OTP Sent', res.data)
                setAlert('Success', 'OTP Sent Successfully', 5000)
                dispatch({
                    type: OTP_SENT,
                    payload: res.data,
                })
            } else {
                console.log(res.data)
                setAlert('Error', 'OTP not sent!')
                dispatch({
                    type: OTP_SEND_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            dispatch({
                type: OTP_SEND_FAIL,
                payload: error,
            })
        }
    }

    //verify OTP
    const verifyOTP = async formData => {
        setLoading()
        const headers = {
            email: formData.email,
            otp: formData.otp,
        }
        try {
            const res = await axios.post('/api/auth/verifyotp', {}, {headers})
            if (res.data.code == 'SUCCESS') {
                console.log('OTP Verified', res.data)
                setAlert('Success', 'OTP Verified Successfully', 10000)
                dispatch({
                    type: OTP_VERIFIED,
                    payload: res.data,
                })
            } else {
                setAlert('Error', 'Email not verified!')
                console.log(res.data)
                dispatch({
                    type: OTP_VERIFY_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            dispatch({
                type: OTP_VERIFY_FAIL,
                payload: error,
            })
        }
    }

    //verify User's Email
    const verifyEmail = async formData => {
        setLoading()
        const headers = {
            email: formData.email,
            otp: formData.otp,
        }
        try {
            const res = await axios.post(
                '/api/auth/verifyaccountemail',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Email Verified', res.data)
                setAlert('Success', 'Email Verified Successfully', 10000)
                dispatch({
                    type: EMAIL_VERIFIED,
                    payload: res.data,
                })
            } else {
                setAlert('Error', 'Email not verified!')
                console.log(res.data)
                dispatch({
                    type: OTP_VERIFY_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            dispatch({
                type: OTP_VERIFY_FAIL,
                payload: error,
            })
        }
    }

    //Reset Password
    const resetPassword = async formData => {
        setLoading()
        const headers = {
            email: formData.email,
            otp: formData.otp,
            newpassword: formData.newpassword,
            confirmnewpassword: formData.confirmnewpassword,
        }
        try {
            const res = await axios.post(
                '/api/auth/forgotpassword',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Password Reset', res.data)
                setAlert('Success', 'Password Reset Successfully', 10000)
                dispatch({
                    type: PASSWORD_RESET,
                    payload: res.data,
                })
                loadUser()
            } else {
                setAlert('Error', 'Password Reset Failed!')
                console.log(res.data)
                dispatch({
                    type: OTP_VERIFY_FAIL,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({
                type: OTP_VERIFY_FAIL,
                payload: error,
            })
        }
    }

    // Set Alert
    const setAlert = (type, msg, timeout = 5000) => {
        dispatch({
            type: SET_ALERT,
            payload: {msg, type},
        })

        setTimeout(() => clearAlert(), timeout)
    }

    //Logout
    const logout = () => dispatch({type: LOGOUT})

    //Clear Errors
    const clearAlert = () => dispatch({type: CLEAR_ALERT})

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                isVerifiedEmail: state.isVerifiedEmail,
                loading: state.loading,
                user: state.user,
                alert: state.alert,
                loadUser,
                login,
                signup,
                sendOTP,
                verifyOTP,
                verifyEmail,
                resetPassword,
                logout,
                setLoading,
                setAlert,
                clearAlert,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthState
