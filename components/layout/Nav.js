import Link from 'next/link'
import classes from './Nav.module.css'
import React, {useContext, useState} from 'react'
import AuthContext from '../../context/auth/authContext'
import ForumContext from '../../context/forum/forumContext'
import UserContext from '../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserCircle, faSearch} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'

function Nav() {
    const forumContext = useContext(ForumContext)
    const {searchQuestion} = forumContext

    const userContext = useContext(UserContext)
    const {searchUser} = userContext

    const authContext = useContext(AuthContext)
    const {isAuthenticated, user, logout} = authContext

    const router = useRouter()

    const [questionquery, setquestionquery] = useState('')

    const questionQueryChange = e => {
        setquestionquery(e.target.value)
    }

    const clickHandler = e => {
        logout()
    }

    const submitSearchQuestions = e => {
        e.preventDefault()
        console.log(questionquery)
        if (questionquery != '') {
            searchQuestion(questionquery)
            searchUser(questionquery)
            router.push('/forum')
        }
    }

    const username = user && user.username

    if (!isAuthenticated) {
        return (
            <header className={classes.header}>
                <Link href="/">
                    <a>
                        <div className="logo">
                            Enord.<span style={{color: 'red'}}>Ai</span>
                        </div>
                    </a>
                </Link>
                <nav>
                    <ul>
                        <li className={classes.profileIcon}>
                            <Link href="/auth">Login</Link>
                        </li>

                        <li className="hide-mob">
                            <Link href="/forum">Forum</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }

    return (
        <header className={classes.header}>
            <Link href="/">
                <a>
                    <div className="logo">
                        Enord.<span style={{color: 'red'}}>Ai</span>
                    </div>
                </a>
            </Link>
            <form onSubmit={submitSearchQuestions} className={classes.search}>
                <input
                    name="questionquery"
                    placeholder="Search Questions or Users..."
                    value={questionquery}
                    onChange={questionQueryChange}
                ></input>
                <button type="submit">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className={classes.search_icon}
                    />
                </button>
            </form>
            <nav>
                <ul>
                    <Link href="/user/profile" passHref={true}>
                        <li className={classes.profileIcon}>
                            {' '}
                            <FontAwesomeIcon
                                icon={faUserCircle}
                                className={classes.icon}
                                size="2x"
                            />
                            <p className="hide-mob">{username}</p>
                        </li>
                    </Link>

                    <li className="hide-mob">
                        <Link href="/forum">Forum</Link>
                    </li>
                    <li>
                        <button className="btn btn-alt" onClick={clickHandler}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Nav
