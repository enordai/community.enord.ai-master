import {
    SET_LOADING,
    GET_USER_PROFILE,
    GET_USER_QUESTIONS,
    PASSWORD_CHANGED,
    ERROR,
    PROFILE_UPDATED,
    SEARCH_USERS,
    CLEAR_RESULTS,
} from '../types'
import {setCookie} from '../utils/Cookies'

// eslint-disable-next-line import/no-anonymous-default-export
const userReducer = (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            }
        case GET_USER_PROFILE:
            return {
                ...state,
                ...action.payload,
                userProfile: action.payload.data,
                loading: false,
            }
        case GET_USER_QUESTIONS:
            return {
                ...state,
                userQuestions: action.payload.data,
                loading: false,
            }
        case PROFILE_UPDATED:
            setCookie('user', JSON.stringify(action.payload.data), 86400)
            return {
                ...state,
                ...action.payload,
                loading: false,
            }
        case PASSWORD_CHANGED:
        case ERROR:
            return {
                ...state,
                userProfile: null,
                loading: false,
                userQuestions: [],
            }
        case SEARCH_USERS:
            return {
                ...state,
                users: action.payload.data,
                loading: false,
            }
        case CLEAR_RESULTS:
            return {
                ...state,
                users: [],
                loading: false,
            }
        default:
            return state
    }
}

export default userReducer
