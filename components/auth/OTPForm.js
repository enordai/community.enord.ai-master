import React, {useContext, useRef, useEffect} from 'react'
import classes from './auth.module.css'
import AuthContext from '../../context/auth/authContext'
import {useRouter} from 'next/dist/client/router'
import Spinner from '../layout/Spinner'
import Alert from '../alert/Alert'

const OTPForm = () => {
    const authContext = useContext(AuthContext)

    const {
        isAuthenticated,
        isVerifiedEmail,
        loading,
        alert,
        setAlert,
        user,
        sendOTP,
        verifyOTP,
        verifyEmail,
    } = authContext

    const OTPRef = useRef()

    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth')
        } else if (isVerifiedEmail) {
            router.replace('/forum')
        } else {
            if (user) sendOTP(user.email)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isVerifiedEmail])

    const submitHandler = e => {
        e.preventDefault()
        if (OTPRef.current.value.length !== 6) {
            setAlert('Error', 'OTP must contain 6 numbers only.')
        } else verifyEmail({email: user.email, otp: OTPRef.current.value})
    }

    return (
        user && (
            <div className={classes.container}>
                <div className={classes.left}></div>
                <div className={classes.right}>
                    {alert && <Alert />}
                    <div className="logo">
                        Enord.<span style={{color: 'red'}}>Ai</span>
                    </div>
                    <h3>Verify OTP</h3>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <form onSubmit={submitHandler} method="POST">
                            <p>
                                Enter OTP sent to <b>{user.email}</b>
                            </p>
                            <input
                                name="OTP"
                                placeholder="Enter OTP"
                                type="text"
                                ref={OTPRef}
                                required
                            />

                            <br />
                            <button className="btn btn-primary" type="submit">
                                Verify{' '}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    )
}

export default OTPForm
