import React, {useContext, useState} from 'react'
import Link from 'next/link'
import classes from './MobileNav.module.css'
import ForumContext from '../../context/forum/forumContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faClock,
    faCommentSlash,
    faUser,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'

function Nav() {
    const forumContext = useContext(ForumContext)
    const {
        searchQuestion,
        getLatestQuestions,
        getUnansweredQuestions,
        clearResults,
    } = forumContext

    const router = useRouter()

    const [questionquery, setquestionquery] = useState('')
    const [showSearch, setshowSearch] = useState(false)

    const questionQueryChange = e => {
        setquestionquery(e.target.value)
    }

    const clickSearch = e => {
        setshowSearch(!showSearch)
    }

    const clickRecent = e => {
        clearResults()
        getLatestQuestions({low: 0, high: 10})
    }

    const submitSearchQuestions = e => {
        e.preventDefault()
        console.log(questionquery)
        if (questionquery != '') {
            searchQuestion(questionquery)
            router.push('/forum')
        }
        setshowSearch(!showSearch)
    }

    const SearchBar = () => {
        return (
            <div className={classes.searchBar}>
                <form onSubmit={submitSearchQuestions}>
                    <input
                        name="questionquery"
                        placeholder="Search Questions..."
                        value={questionquery}
                        onChange={questionQueryChange}
                    ></input>
                    <button type="submit" className="btn btn-primary">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className={classes.search_icon}
                        />
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className={classes.footer}>
            {showSearch && SearchBar()}
            <div className={classes.bottomNav}>
                <div className={classes.bottomNavIcon} onClick={clickSearch}>
                    <FontAwesomeIcon
                        icon={faSearch}
                        className={classes.icon}
                        size="lg"
                    />
                    <p>Search</p>
                </div>

                <Link href="/forum" passHref={true}>
                    <div
                        className={classes.bottomNavIcon}
                        onClick={clickRecent}
                    >
                        <FontAwesomeIcon
                            icon={faClock}
                            className={classes.icon}
                            size="lg"
                        />
                        <p>Recent</p>
                    </div>
                </Link>

                <Link href="/user/profile" passHref={true}>
                    <div className={classes.bottomNavIcon}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={classes.search_icon}
                            size="lg"
                        />
                        <p>Profile</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Nav
