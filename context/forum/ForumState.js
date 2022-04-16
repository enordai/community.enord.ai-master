import React, {useContext, useReducer} from 'react'
import axios from 'axios'
import ForumContext from './forumContext'
import forumReducer from './forumReducer'
import AuthContext from '../auth/authContext'

import {
    SET_LOADING,
    LOAD_ALL_QUESTIONS,
    QUESTION_ADDED,
    SEARCH_QUESTION,
    GET_QUESTION,
    GET_COMMENTS,
    GET_ANSWER_COMMENTS,
    CLEAR_RESULTS,
    CLEAR_QUESTION,
    ERROR,
} from '../types'

const ForumState = props => {
    const initialState = {
        questions: [],
        answers: null,
        loading: true,
        selectedQuestion: {},
        searchResults: null,
        questionAdded: false,
    }

    const authContext = useContext(AuthContext)
    const {setAlert} = authContext

    const [state, dispatch] = useReducer(forumReducer, initialState)

    //Loading
    const setLoading = async () => {
        dispatch({type: SET_LOADING})
    }

    //Get Full Data of any Question by its searchId
    const getFullQuestionData = async (search, uid) => {
        setLoading()
        const headers = {
            search: search,
            uid: uid,
        }
        try {
            const res = await axios.post(
                '/api/question/get',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Question: ', res.data)
                dispatch({type: GET_QUESTION, payload: res.data})
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Get Question by ID
    const getQuestionById = async id => {
        setLoading()
        // const headers = {
        //     id: id,
        // }
        // try {
        //     const res = await axios.post(
        //         '/api/question/getbyid',
        //         {},
        //         {
        //             headers,
        //         },
        //     )
        //     if (res.data.code == 'SUCCESS') {
        //         console.log('Question: ', res.data)
        //         dispatch({type: GET_QUESTION, payload: res.data})
        //     } else {
        //         setAlert('Error', res.data.code)
        //         console.log(res.data)
        // dispatch({type: ERROR})
        //     }
        // } catch (error) {
        //     setAlert('Error', 'Server Error!')
        //     console.log('Error:', error)
        // dispatch({type: ERROR})
        // }
    }

    //Clear Question
    const clearQuestion = async () => {
        dispatch({type: CLEAR_QUESTION})
    }

    //Add a Question
    const addQuestion = async (formData, body) => {
        setLoading()
        const headers = {
            uid: formData.uid,
            title: formData.title,
            tags: formData.tags,
            'Content-Type': 'text/plain',
        }
        try {
            const res = await axios.post('/api/question/add', body, {
                headers,
            })
            if (res.data.code == 'SUCCESS') {
                console.log('Question Added: ', res.data)
                dispatch({type: QUESTION_ADDED})
                setAlert('Success', 'Question Added Successfully', 5000)
                getFullQuestionData(res.data.qid, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Edit Question
    const editQuestion = async () => {
        dispatch({type: SET_LOADING})
    }

    //Delete Question
    const deleteQuestion = async () => {
        dispatch({type: SET_LOADING})
    }

    //Add a Comment to Question
    const addCommentToQuestion = async formData => {
        setLoading()
        const headers = {
            qid: formData.qid,
            uid: formData.uid,
            search: formData.search,
            comment: formData.comment,
        }
        try {
            const res = await axios.post(
                '/api/question/addcomment',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Comment Added: ', res.data)
                setAlert('Success', 'Comment Added Successfully', 5000)
                getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Get Comments of a Question
    const getCommentsOfQuestion = async formData => {
        setLoading()
        const headers = {
            qid: formData.qid,
            low: formData.low,
            high: formData.high,
            search: formData.search,
        }
        try {
            const res = await axios.post(
                '/api/question/getcomments',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Comments: ', res.data)
                dispatch({type: GET_COMMENTS, payload: res.data})
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Bookmark Question
    const bookmarkQuestion = async formData => {
        const headers = {
            uid: formData.uid,
            qid: formData.qid,
            search: formData.search,
        }
        try {
            const res = await axios.post(
                '/api/question/bookmark',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'BOOKMARK_ADDED' || 'BOOKMARK_REMOVED') {
                console.log('Bookmarked: ', res.data)
                //getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Vote Question
    const voteQuestion = async formData => {
        console.log('Vote value', formData.vote)
        const headers = {
            uid: formData.uid,
            qid: formData.qid,
            search: formData.search,
            vote: formData.vote,
        }
        try {
            const res = await axios.post(
                '/api/question/vote',
                {},
                {
                    headers,
                },
            )
            if (
                res.data.code == 'VOTE_CREATED_SUCCESSFULLY' ||
                'VOTE_UPDATED_SUCCESSFULLY'
            ) {
                console.log('Voted: ', res.data)
                //getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Answer a Question
    const answerQuestion = async (formData, body) => {
        setLoading()
        const headers = {
            uid: formData.uid,
            qid: formData.qid,
            search: formData.search,
            'Content-Type': 'text/plain',
        }
        try {
            const res = await axios.post('/api/question/answer/add', body, {
                headers,
            })
            if (res.data.code == 'SUCCESS') {
                console.log('Answer Added: ', res.data)
                setAlert('Success', 'Answer Added Successfully', 5000)
                getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Edit Answer
    const editAnswer = async () => {
        dispatch({type: SET_LOADING})
    }

    //Delete Answer
    const deleteAnswer = async () => {
        dispatch({type: SET_LOADING})
    }

    //Add a Comment to Answer
    const addCommentToAnswer = async formData => {
        setLoading()
        const headers = {
            qid: formData.qid,
            uid: formData.uid,
            aid: formData.aid,
            search: formData.search,
            comment: formData.comment,
        }
        try {
            const res = await axios.post(
                '/api/question/answer/addcomment',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Comment Added: ', res.data)
                setAlert('Success', 'Comment Added Successfully', 5000)
                getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Get Comments of an Answer
    const getCommentsOfAnswer = async formData => {
        setLoading()
        const headers = {
            aid: formData.aid,
            low: formData.low,
            high: formData.high,
            search: formData.search,
        }
        try {
            const res = await axios.post(
                '/api/question/answer/getcomment',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Comments: ', res.data)
                dispatch({type: GET_ANSWER_COMMENTS, payload: res.data})
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Vote Answer
    const voteAnswer = async formData => {
        console.log('Vote value', formData.vote)
        const headers = {
            uid: formData.uid,
            qid: formData.qid,
            aid: formData.aid,
            search: formData.search,
            vote: formData.vote,
        }
        try {
            const res = await axios.post(
                '/api/question/answer/vote',
                {},
                {
                    headers,
                },
            )
            if (
                res.data.code == 'VOTE_CREATED_SUCCESSFULLY' ||
                'VOTE_UPDATED_SUCCESSFULLY'
            ) {
                console.log('Answer Voted: ', res.data)
                //getFullQuestionData(formData.search, formData.uid)
            } else {
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Search Question by id
    const searchQuestion = async query => {
        setLoading()
        const headers = {
            query: query,
        }
        try {
            const res = await axios.post(
                '/api/question/search',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Search: ', res.data)
                dispatch({type: SEARCH_QUESTION, payload: res.data})
            } else {
                if (res.data.code == 'QUESTION_NOT_FOUND')
                    dispatch({type: CLEAR_RESULTS})
                setAlert('Error', res.data.code)
                console.log(res.data)
                dispatch({type: ERROR, payload: res.data})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Search Latest Questions
    const getLatestQuestions = async formData => {
        setLoading()
        const headers = {
            low: formData.low,
            high: formData.high,
        }
        try {
            const res = await axios.post(
                '/api/question/latest',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Latest: ', res.data)
                dispatch({type: LOAD_ALL_QUESTIONS, payload: res.data})
            } else {
                if (res.data.code == 'QUESTION_NOT_FOUND')
                    dispatch({type: CLEAR_RESULTS})
                setAlert('Error', 'No Questions Found!')
                console.log(res.data)
                dispatch({type: ERROR, payload: res.data})
            }
        } catch (error) {
            setAlert('Error', 'Server Error!')
            console.log('Error:', error)
            dispatch({type: ERROR})
        }
    }

    //Search Unanswererd Questions
    const getUnansweredQuestions = async formData => {
        setLoading()
        const headers = {
            low: formData.low,
            high: formData.high,
        }
        try {
            const res = await axios.post(
                '/api/question/unanwered',
                {},
                {
                    headers,
                },
            )
            if (res.data.code == 'SUCCESS') {
                console.log('Unanswered: ', res.data)
                dispatch({type: SEARCH_QUESTION, payload: res.data})
            } else {
                if (res.data.code == 'QUESTION_NOT_FOUND')
                    dispatch({type: CLEAR_RESULTS})
                setAlert('Error', res.data.code)
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
    const clearResults = async => {
        dispatch({type: CLEAR_RESULTS})
    }

    return (
        <ForumContext.Provider
            value={{
                questions: state.questions,
                answers: state.answers,
                loading: state.loading,
                questionAdded: state.questionAdded,
                selectedQuestion: state.selectedQuestion,
                searchResults: state.searchResults,
                getFullQuestionData,
                getQuestionById,
                searchQuestion,
                getLatestQuestions,
                getUnansweredQuestions,
                clearResults,
                clearQuestion,
                setLoading,
                addQuestion,
                answerQuestion,
                addCommentToQuestion,
                getCommentsOfQuestion,
                getCommentsOfAnswer,
                addCommentToAnswer,
                bookmarkQuestion,
                voteQuestion,
                voteAnswer,
            }}
        >
            {props.children}
        </ForumContext.Provider>
    )
}
export default ForumState
