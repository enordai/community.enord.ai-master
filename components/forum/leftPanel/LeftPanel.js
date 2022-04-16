import {useContext, useState} from 'react'
import classes from './LeftPanel.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faHouseUser,
    faEye,
    faClock,
    faComment,
    faCommentSlash,
    faUser,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import ForumContext from '../../../context/forum/forumContext'
import UserContext from '../../../context/user/userContext'
import {useRouter} from 'next/dist/client/router'
import Link from 'next/link'

const LeftPanel = () => {
    const forumContext = useContext(ForumContext)
    const {
        searchQuestion,
        getLatestQuestions,
        getUnansweredQuestions,
        clearResults,
    } = forumContext

    const userContext = useContext(UserContext)
    const {searchUser} = userContext

    const router = useRouter()

    const [highlight, setHighlight] = useState('recent')
    const [questionquery, setquestionquery] = useState('')

    const questionQueryChange = e => {
        setquestionquery(e.target.value)
    }

    const submitSearchQuestions = e => {
        e.preventDefault()
        console.log(questionquery)
        if (questionquery != '') {
            searchQuestion(questionquery)
            router.push('/forum')
        }
    }

    const clickRecent = e => {
        setHighlight('recent')
        clearResults()
        getLatestQuestions({low: 0, high: 10})
    }

    const clickUnanswered = e => {
        setHighlight('unanswered')
        clearResults()
        getUnansweredQuestions({low: 0, high: 10})
    }

    const highlightStyle = {
        borderLeft: '5px solid #3d5af1',
        background: '#e8ebfb',
        color: '#3d5af1',
    }

    return (
        <div className={classes.left}>
            <ul>
                <li className={classes.search}>
                    <form onSubmit={submitSearchQuestions}>
                        <input
                            name="questionquery"
                            placeholder="Search Questions..."
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
                </li>

                <Link href="/" passHref={true}>
                    <li
                        onClick={() => setHighlight('home')}
                        style={highlight == 'home' ? highlightStyle : null}
                    >
                        <FontAwesomeIcon
                            icon={faHouseUser}
                            className={classes.icon}
                            size="lg"
                        />
                        Home
                    </li>
                </Link>

                <Link href="/forum" passHref={true}>
                    <li
                        onClick={clickRecent}
                        style={highlight == 'recent' ? highlightStyle : null}
                    >
                        <FontAwesomeIcon
                            icon={faClock}
                            className={classes.icon}
                            size="lg"
                        />
                        Recent
                    </li>
                </Link>

                <li>
                    <FontAwesomeIcon
                        icon={faComment}
                        className={classes.icon}
                        size="lg"
                    />
                    Popular
                </li>

                <Link href="/forum" passHref={true}>
                    <li
                        onClick={clickUnanswered}
                        style={
                            highlight == 'unanswered' ? highlightStyle : null
                        }
                    >
                        <FontAwesomeIcon
                            icon={faCommentSlash}
                            className={classes.icon}
                            size="lg"
                        />
                        Unanswered
                    </li>
                </Link>

                <li>
                    <FontAwesomeIcon
                        icon={faEye}
                        className={classes.icon}
                        size="lg"
                    />
                    Most Visited
                </li>
            </ul>
        </div>
    )
}

export default LeftPanel
