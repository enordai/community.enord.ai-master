import React, {useState, useContext, useRef, useEffect, Fragment} from 'react'
import classes from './auth.module.css'
import AuthContext from '../../context/auth/authContext'
import Link from 'next/link'
import {useRouter} from 'next/dist/client/router'
import Spinner from '../layout/Spinner'
import Alert from '../alert/Alert'

const Login = props => {
    const authContext = useContext(AuthContext)

    const {
        login,
        isAuthenticated,
        isVerifiedEmail,
        loading,
        user,
        alert,
        sendOTP,
        resetPassword,
        setAlert,
    } = authContext

    const userNameRef = useRef()
    const passwordRef = useRef()

    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            if (!isVerifiedEmail) {
                router.replace('/auth/verify')
            } else router.replace('/forum')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    const [passForgotDisplay, setPassForgotDisplay] = useState(false)
    const emailRef = useRef()
    const OTPRef = useRef()
    const newPassRef = useRef()
    const confirmNewPassRef = useRef()

    const onForgotPassClick = () => {
        setPassForgotDisplay(true)
    }

    const submitHandler = e => {
        e.preventDefault()
        login({
            user: userNameRef.current.value,
            password: passwordRef.current.value,
        })
    }

    const forgotSubmitHandler = e => {
        e.preventDefault()
        if (newPassRef.current.value !== confirmNewPassRef.current.value) {
            setAlert('Error', "Passwords don't match!")
        } else
            resetPassword({
                email: emailRef.current.value,
                otp: OTPRef.current.value,
                newpassword: newPassRef.current.value,
                confirmnewpassword: confirmNewPassRef.current.value,
            })
    }

    const PassForgotForm = () => {
        return (
            <form onSubmit={forgotSubmitHandler} method="POST">
                <input
                    name="otp"
                    placeholder="OTP"
                    type="text"
                    ref={OTPRef}
                    required
                />
                <input
                    name="newpassword"
                    placeholder="New Password"
                    type="password"
                    ref={newPassRef}
                    required
                />
                <input
                    name="confirmnewpassword"
                    placeholder="Confirm New Password"
                    type="password"
                    ref={confirmNewPassRef}
                    required
                />
                <br />
                <button className="btn btn-primary" type="submit">
                    Reset{' '}
                </button>
            </form>
        )
    }

    const clickOTP = () => {
        sendOTP(emailRef.current.value)
    }

    if (passForgotDisplay) {
        return (
            <div className={classes.container}>
                <div className={classes.left}></div>
                <div className={classes.right}>
                    {alert && <Alert />}
                    <div className="logo">
                        Enord.<span style={{color: 'red'}}>Ai</span>
                    </div>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <input
                                className={classes.otpEmail}
                                name="email"
                                placeholder="Email"
                                type="text"
                                ref={emailRef}
                                required
                            />
                            <button
                                className="btn btn-secondary"
                                type="submit"
                                onClick={clickOTP}
                            >
                                Send OTP{' '}
                            </button>
                            <PassForgotForm />
                        </Fragment>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}></div>
            <div className={classes.right}>
                {alert && <Alert />}
                <div className="logo">
                    Enord.<span style={{color: 'red'}}>Ai</span>
                </div>
                <h3>Login to your account</h3>
                {loading ? (
                    <Spinner />
                ) : (
                    <form onSubmit={submitHandler} method="POST">
                        <input
                            name="username"
                            placeholder="Username"
                            type="text"
                            ref={userNameRef}
                            required
                        />
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            ref={passwordRef}
                            required
                        />
                        <br />
                        <p
                            className={classes.forgotPass}
                            onClick={onForgotPassClick}
                        >
                            Forgot Password?
                        </p>
                        <div style={{margin: '20px 0'}}>
                            <button className="btn btn-primary" type="submit">
                                Login{' '}
                            </button>{' '}
                            Or<Link href="/auth/signup"> Signup</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login
