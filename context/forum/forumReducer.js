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

// eslint-disable-next-line import/no-anonymous-default-export
const forumReducer = (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            }
        case LOAD_ALL_QUESTIONS:
            return {
                ...state,
                questions: action.payload.data,
                loading: false,
            }
        case QUESTION_ADDED:
            return {
                ...state,
                questionAdded: true,
                loading: false,
            }
        case SEARCH_QUESTION:
            return {
                ...state,
                searchResults: action.payload.data,
                loading: false,
            }
        case CLEAR_RESULTS:
            return {
                ...state,
                searchResults: null,
                loading: false,
            }
        case GET_QUESTION:
            return {
                ...state,
                selectedQuestion: action.payload.data,
                loading: false,
            }
        case GET_COMMENTS:
            const size1 = action.payload.data.length
            const size2 = state.selectedQuestion.questionComments.length
            if (
                action.payload.data[size1 - 1].search !=
                state.selectedQuestion.questionComments[size2 - 1].search
            )
                action.payload.data.map(comment =>
                    state.selectedQuestion.questionComments.push(comment),
                )
            return {
                ...state,
                loading: false,
            }
        case GET_ANSWER_COMMENTS:
            const size3 = action.payload.data.length
            const size4 = state.selectedQuestion.answersComments.length
            if (
                action.payload.data[size3 - 1].search !=
                state.selectedQuestion.answersComments[size4 - 1].search
            )
                action.payload.data.map(comment =>
                    state.selectedQuestion.answersComments.push(comment),
                )
            return {
                ...state,
                loading: false,
            }
        case CLEAR_QUESTION:
            return {
                ...state,
                selectedQuestion: {},
                loading: false,
            }
        case ERROR:
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}

export default forumReducer
