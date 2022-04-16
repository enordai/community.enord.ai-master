import React, {useContext, useRef, useEffect} from 'react'
import classes from './auth.module.css'
import AuthContext from '../../context/auth/authContext'
import Link from 'next/link'
import {useRouter} from 'next/dist/client/router'
import Spinner from '../layout/Spinner'
import Alert from '../alert/Alert'

const Signup = () => {
    const authContext = useContext(AuthContext)

    const {signup, isAuthenticated, isVerifiedEmail, loading, alert} =
        authContext

    const userNameRef = useRef()
    const emailRef = useRef()
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

    const submitHandler = e => {
        e.preventDefault()
        signup({
            user: userNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        })
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}></div>
            <div className={classes.right}>
                {alert && <Alert />}
                <div className="logo">
                    Enord.<span style={{color: 'red'}}>Ai</span>
                </div>
                <h3>Create an account</h3>
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
                            name="email"
                            placeholder="Email"
                            type="email"
                            ref={emailRef}
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
                        <div style={{margin: '20px 0'}}>
                            <button className="btn btn-primary" type="submit">
                                Sign up{' '}
                            </button>{' '}
                            Or<Link href="/auth"> Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Signup
