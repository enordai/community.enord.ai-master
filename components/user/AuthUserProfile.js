import React, {Fragment, useContext, useEffect, useState, useRef} from 'react'
import classes from './UserProfile.module.css'
import LeftPanel from '../forum/leftPanel/LeftPanel'
import RightPanel from '../forum/rightPanel/RightPanel'
import AuthContext from '../../context/auth/authContext'
import UserContext from '../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserCircle, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'
import ForumItem from '../forum/forumItem/ForumItem'
import Spinner from '../layout/Spinner'
import Alert from '../alert/Alert'
import InfoBox from './InfoBox'
import Link from 'next/link'

function AuthUserProfile(props) {
    const authContext = useContext(AuthContext)
    const {isAuthenticated, user, setAlert, alert, loading} = authContext

    const userContext = useContext(UserContext)
    const {
        userProfile,
        getUserProfile,
        userQuestions,
        clearProfile,
        changePassword,
    } = userContext

    const router = useRouter()

    const oldPassRef = useRef()
    const newPassRef = useRef()
    const confirmNewPassRef = useRef()

    const [passFormDisplay, setPassFormDisplay] = useState('none')

    useEffect(() => {
        if (!userProfile || userProfile.username != user.username) {
            clearProfile()
            setTimeout(() => getUserProfile(user.username), 1000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = () => {
        if (passFormDisplay == 'none') setPassFormDisplay('block')
        else setPassFormDisplay('none')
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (newPassRef.current.value !== confirmNewPassRef.current.value) {
            setAlert('Error', "Passwords don't match!")
        }
        changePassword({
            user: user.username,
            oldpassword: oldPassRef.current.value,
            newpassword: newPassRef.current.value,
            confirmnewpassword: confirmNewPassRef.current.value,
        })
    }

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

    if (!isAuthenticated) {
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
                            className="hide-mob"
                            size="6x"
                        />
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className={classes.profileImg}
                            size="4x"
                        />
                        <div className={classes.userInfo}>
                            <h2>
                                {user.username}
                                {user.verified_email && (
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

                            <p>{user.email}</p>
                            {!user.verified_email && (
                                <Link href="/auth/verify" passHref={true}>
                                    <p
                                        style={{
                                            color: 'blue',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Verify Email
                                    </p>
                                </Link>
                            )}
                            <h4
                                className={classes.changePass}
                                onClick={handleClick}
                            >
                                Change Password
                            </h4>
                        </div>
                    </div>
                </div>

                <div
                    className={classes.form_container}
                    style={{display: passFormDisplay}}
                >
                    {alert && <Alert />}
                    <h3>Change Password</h3>
                    <form onSubmit={handleSubmit}>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <Fragment>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    ref={oldPassRef}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    ref={newPassRef}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    ref={confirmNewPassRef}
                                />
                                <button className="btn btn-primary">
                                    Update
                                </button>
                            </Fragment>
                        )}
                    </form>
                </div>

                <InfoBox />

                <h1>Your Recent Posts</h1>
                {loading ? <Spinner /> : renderQuestions()}
            </div>
            {/* <RightPanel /> */}
        </div>
    )
}

export default AuthUserProfile
