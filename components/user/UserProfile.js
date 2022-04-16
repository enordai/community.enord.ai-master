import React, {Fragment, useContext, useEffect, useState, useRef} from 'react'
import classes from './UserProfile.module.css'
import LeftPanel from '../forum/leftPanel/LeftPanel'
import RightPanel from '../forum/rightPanel/RightPanel'
import UserContext from '../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGithub, faTwitter} from '@fortawesome/free-brands-svg-icons'
import {faUserCircle, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'
import ForumItem from '../forum/forumItem/ForumItem'
import Spinner from '../layout/Spinner'

function UserProfile(props) {
    const userContext = useContext(UserContext)
    const {userProfile, getUserProfile, loading, userQuestions, clearProfile} =
        userContext

    const router = useRouter()

    useEffect(() => {
        console.log(props.user)
        if (!userProfile || userProfile.username != props.user) {
            clearProfile()
            setTimeout(() => getUserProfile(props.user), 1000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    const renderQuestions = () => {
        return (
            <Fragment>
                {userQuestions.length > 0 ? (
                    userQuestions.map(question => {
                        return (
                            <ForumItem key={question.qid} question={question} />
                        )
                    })
                ) : (
                    <p>No Questions Posted</p>
                )}
            </Fragment>
        )
    }

    if (!userProfile) {
        return null
    }

    return loading ? (
        <Spinner />
    ) : (
        <div className={classes.main_container}>
            <LeftPanel />
            <div className={classes.center}>
                <div className={classes.header}>
                    <div className={classes.userIcon}>
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className={classes.img}
                            size="5x"
                        />
                        <div className={classes.userInfo}>
                            <h2>
                                {userProfile.username}
                                {userProfile.verified_email && (
                                    <div className="tooltip">
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            size="xs"
                                        />
                                        <span className="tooltiptext">
                                            Verified Email
                                        </span>
                                    </div>
                                )}
                            </h2>
                            <p>{userProfile.email}</p>
                        </div>
                    </div>
                </div>

                <div className={classes.user_info}>
                    <h3>{userProfile.username}&lsquo;s Info</h3>

                    <p>
                        Fullname: <b>{userProfile.fullname}</b>
                    </p>
                    <p>
                        Questions: <b>{userProfile.questions_count}</b>{' '}
                    </p>

                    <p>
                        Answers: <b>{userProfile.answers_count}</b>{' '}
                    </p>

                    <p>
                        <FontAwesomeIcon
                            icon={faTwitter}
                            className={classes.img}
                            size="2x"
                        />
                        :{' '}
                        {userProfile.twitter !== null
                            ? userProfile.twitter
                            : '—'}
                    </p>
                    <p>
                        <FontAwesomeIcon
                            icon={faGithub}
                            className={classes.img}
                            size="2x"
                        />
                        :{' '}
                        {userProfile.github !== null ? userProfile.github : '—'}
                    </p>
                </div>

                <h1>{userProfile.username}&lsquo;s Recent Questions</h1>
                {loading ? <Spinner /> : renderQuestions()}
            </div>
            {/* <RightPanel /> */}
        </div>
    )
}

export default UserProfile
