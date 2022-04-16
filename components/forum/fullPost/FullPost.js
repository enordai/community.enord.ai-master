import React, {useContext, useEffect, useState} from 'react'
import classes from './FullPost.module.css'
import LeftPanel from '../leftPanel/LeftPanel'
import RightPanel from '../rightPanel/RightPanel'
import Question from '../question/Question'
import Answer from '../answer/Answer'
import AnswerQuestion from '../answer/AnswerQuestion'
import ForumContext from '../../../context/forum/forumContext'
import AuthContext from '../../../context/auth/authContext'
import Spinner from '../../layout/Spinner'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment} from '@fortawesome/free-solid-svg-icons'

function ForumPost(props) {
    const forumContext = useContext(ForumContext)
    const {
        getFullQuestionData,
        getQuestionById,
        selectedQuestion,
        loading,
        clearQuestion,
        setLoading,
    } = forumContext

    const authContext = useContext(AuthContext)
    const {user} = authContext

    const [fullQuestionData, setFullQuestionData] = useState({
        question: null,
        answers: null,
        comments: null,
    })

    useEffect(() => {
        clearQuestion()
        setLoading()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (Object.keys(selectedQuestion).length === 0)
            setTimeout(() => getFullQuestionData(props.qid, user.uid), 1000)
        setFullQuestionData(selectedQuestion)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    const {
        question,
        questionComments,
        answers,
        answersComments,
        questionVoted,
        answersVoted,
        questionBookmarked,
        questionCommentsPage,
    } = fullQuestionData

    if (loading || !fullQuestionData.question) {
        return <Spinner />
    }
    return (
        <div className={classes.main_container}>
            <LeftPanel />
            <div className={classes.center}>
                <Question
                    question={question}
                    questionComments={questionComments}
                    questionVoted={questionVoted}
                    questionBookmarked={questionBookmarked}
                    questionCommentsPage={questionCommentsPage}
                />
                <h2>
                    <FontAwesomeIcon
                        icon={faComment}
                        className={classes.inactiveIcon}
                    />{' '}
                    Top Answers
                </h2>

                {answers.length > 0 &&
                    answers.map(answer => {
                        return (
                            <Answer
                                key={answer.aid}
                                answer={answer}
                                comments={answersComments}
                                question={question}
                                answersVoted={answersVoted}
                            />
                        )
                    })}
                <AnswerQuestion question={question} />
            </div>
            {/* <RightPanel /> */}
        </div>
    )
}

export default ForumPost
