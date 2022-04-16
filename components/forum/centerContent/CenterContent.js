import React, {Fragment, useContext, useState, useEffect, useRef} from 'react'
import classes from '../Forum.module.css'
import ForumItem from '../forumItem/ForumItem'
import Spinner from '../../layout/Spinner'
import Alert from '../../alert/Alert'
import AuthContext from '../../../context/auth/authContext'
import ForumContext from '../../../context/forum/forumContext'
import UserContext from '../../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'
import UserList from '../../user/UserList'

const CenterContent = ({questions, heading, button}) => {
    const authContext = useContext(AuthContext)
    const {alert} = authContext

    const userContext = useContext(UserContext)
    const {users} = userContext

    const forumContext = useContext(ForumContext)
    const {getLatestQuestions, loading, clearResults} = forumContext

    const router = useRouter()

    const didMount = useRef(false)

    const handleAskClick = () => {
        router.push('/forum/ask')
    }

    const handleClearClick = () => {
        clearResults()
    }

    const [low, setLow] = useState(0)
    const [high, setHigh] = useState(10)

    const clickNext = e => {
        setLow(high)
        setHigh(high + 5)
    }

    useEffect(() => {
        if (didMount.current) {
            console.log('low:', low)
            getLatestQuestions({low, high})
        } else didMount.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [low, high])

    return (
        <div className={classes.center}>
            {alert && <Alert />}
            {users.length > 0 && <UserList />}
            <div className={classes.header}>
                <h1>{heading}</h1>
                {button == 'ask' ? (
                    <button
                        className="btn btn-primary"
                        onClick={handleAskClick}
                    >
                        Ask a Question
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleClearClick}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} /> Clear Results
                    </button>
                )}
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    {questions.length > 0 &&
                        questions.map(question => {
                            return (
                                <ForumItem
                                    key={question.qid}
                                    question={question}
                                />
                            )
                        })}
                    {button == 'ask' && (
                        <p className={classes.link} onClick={clickNext}>
                            Next Page
                            <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                    )}
                </Fragment>
            )}
        </div>
    )
}

export default CenterContent
