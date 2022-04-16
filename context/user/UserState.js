import React, {useContext, useReducer} from 'react'
import axios from 'axios'
import UserContext from './userContext'
import userReducer from './userReducer'
import AuthContext from '../auth/authContext'

import {
    PASSWORD_CHANGED,
    ERROR,
    GET_USER_PROFILE,
    GET_USER_QUESTIONS,
    SET_LOADING,
    PROFILE_UPDATED,
    SEARCH_USERS,
    CLEAR_RESULTS,
} from '../types'

const UserState = props => {
    const initialState = {
        userProfile: null,
        loading: true,
        userQuestions: [],
        users: [],
    }

    const authContext = useContext(AuthContext)
    const {setAlert, loadUser} = authContext

    const [state, dispatch] = useReducer(userReducer, initialState)

    //Set Loading
    const setUserLoading = () => {
        dispatch({type: SET_LOADING})
    }

    //Get User Profile by username
    const getUserProfile = async user => {
        setUserLoading()
        const headers = {
            user: user,
        }
        try {
            const res = await axios.post(
                '/api/account/getuserdata',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('User Fetched: ', res.data)
                dispatch({
                    type: GET_USER_PROFILE,
                    payload: res.data,
                })
                getQuestionsByUserId(res.data.data.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({
                    type: ERROR,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({
                type: ERROR,
                payload: error,
            })
        }
    }

    //Clear userProfile
    const clearProfile = async () => {
        dispatch({type: ERROR})
    }

    //Get Question by UserID
    const getQuestionsByUserId = async uid => {
        setUserLoading()
        const headers = {
            uid: uid,
        }
        try {
            const res = await axios.post(
                '/api/question/getbyuid',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('User Questions: ', res.data)
                dispatch({type: GET_USER_QUESTIONS, payload: res.data})
            } else if (res.data.code == 'QUESTION_NOT_FOUND') {
                setAlert('Error', 'No Questions Added', 2000)
                dispatch({type: GET_USER_QUESTIONS, payload: {data: []}})
            } else {
                setAlert('Error', res.data.code, 2000)
                console.log(res.data)
                dispatch({
                    type: ERROR,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
        }
    }

    //Update User Profile
    const updateUserProfile = async formData => {
        setUserLoading()
        const headers = {
            user: formData.user,
            fullname: formData.fullname,
            gender: formData.gender,
            phone: formData.phone,
        }
        try {
            const res = await axios.post(
                '/api/account/updateprofile',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Profile Updated: ', res.data)
                setAlert('Success', 'Profile Updated Successfully', 5000)
                dispatch({
                    type: PROFILE_UPDATED,
                    payload: res.data,
                })
                loadUser()
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({
                    type: ERROR,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({
                type: ERROR,
                payload: error,
            })
        }
    }

    //Update Social Links
    const updateSocialLinks = async formData => {
        setUserLoading()
        const headers = {
            user: formData.user,
            github: formData.github,
            twitter: formData.twitter,
        }
        try {
            const res = await axios.post(
                '/api/account/updatesociallinks',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Profile Updated: ', res.data)
                setAlert('Success', 'Profile Updated Successfully', 5000)
                dispatch({
                    type: PROFILE_UPDATED,
                    payload: res.data,
                })
                loadUser()
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({
                    type: ERROR,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({
                type: ERROR,
                payload: error,
            })
        }
    }

    //Change Password
    const changePassword = async formData => {
        setUserLoading()
        const headers = {
            user: formData.user,
            oldpassword: formData.oldpassword,
            newpassword: formData.newpassword,
            confirmnewpassword: formData.confirmnewpassword,
        }
        try {
            const res = await axios.post(
                '/api/account/updatepassword',
                {},
                {headers},
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Password Changed', res.data)
                setAlert('Success', 'Password Changed Successfully', 5000)
                dispatch({
                    type: PASSWORD_CHANGED,
                    payload: res.data,
                })
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({
                    type: ERROR,
                    payload: res.data.code,
                })
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({
                type: ERROR,
                payload: error,
            })
        }
    }

    //Search User by username/fullname
    const searchUser = async query => {
        setUserLoading()
        const headers = {
            query: query,
        }
        try {
            const res = await axios.post(
                '/api/users/search',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Users: ', res.data)
                dispatch({type: SEARCH_USERS, payload: res.data})
            } else {
                if (res.data.code == 'USER_NOT_FOUND')
                    dispatch({type: CLEAR_RESULTS})
                console.log(res.data)
                dispatch({type: ERROR, payload: res.data})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Clear Search Results
    const clearUserResults = async => {
        dispatch({type: CLEAR_RESULTS})
    }

    return (
        <UserContext.Provider
            value={{
                userProfile: state.userProfile,
                userQuestions: state.userQuestions,
                loading: state.loading,
                users: state.users,
                changePassword,
                getUserProfile,
                clearProfile,
                clearUserResults,
                getQuestionsByUserId,
                updateUserProfile,
                updateSocialLinks,
                searchUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}
export default UserState
