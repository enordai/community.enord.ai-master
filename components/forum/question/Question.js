import {useState, useContext, useEffect, useRef} from 'react'
import classes from './Question.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faReply,
    faArrowUp,
    faArrowDown,
    faBookmark,
} from '@fortawesome/free-solid-svg-icons'
import ForumContext from '../../../context/forum/forumContext'
import AuthContext from '../../../context/auth/authContext'
import Comment from '../comment/Comment'
import Markdown from '../../layout/Markdown'
import Link from 'next/link'

const Question = props => {
    const forumContext = useContext(ForumContext)
    const {
        bookmarkQuestion,
        voteQuestion,
        addCommentToQuestion,
        getCommentsOfQuestion,
    } = forumContext

    const authContext = useContext(AuthContext)
    const {user} = authContext

    const [bookmark, setBookmark] = useState(props.questionBookmarked)
    const [commentFormDisplay, setCommentFormDisplay] = useState('none')
    const [commentText, setcommentText] = useState('')
    const [vote, setVote] = useState(props.questionVoted)
    const [upvotes, setUpvotes] = useState(props.question.upvotes)
    const [bookNotVote, setBookNotVote] = useState('')

    const {
        qid,
        search,
        title,
        body,
        total_answers,
        uid,
        comments,
        username,
        added_at,
        tags,
    } = props.question

    const tagsArray = tags.split(' ')

    const formattedDate = new Date(added_at).toLocaleDateString('en-GB')

    const questionComments = props.questionComments

    const bookmarkStyle = {
        color: '#ffda35',
    }

    const upvoteStyle = {
        color: '#13b775',
    }

    const downvoteStyle = {
        color: '#ff3553',
    }

    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) {
            if (bookNotVote == 1 || bookNotVote == 0) {
                const bookmarkData = {
                    uid: user.uid,
                    qid: qid,
                    search: search,
                }
                console.log(bookmarkData)
                bookmarkQuestion(bookmarkData)
            } else {
                const voteData = {
                    uid: user.uid,
                    qid: qid,
                    search: search,
                    vote: vote,
                }
                console.log(voteData)
                voteQuestion(voteData)
            }
        } else didMount.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookNotVote])

    const clickBookmark = e => {
        if (bookmark == 1) {
            setBookmark(0)
            setBookNotVote(0)
        } else {
            setBookmark(1)
            setBookNotVote(1)
        }
    }

    const clickUpvote = e => {
        if (vote == 1) {
            setVote(0)
            setUpvotes(upvotes - 1)
            setBookNotVote(2)
        } else if (vote == -1) {
            setVote(1)
            setUpvotes(upvotes + 2)
            setBookNotVote(3)
        } else {
            setVote(1)
            setUpvotes(upvotes + 1)
            setBookNotVote(4)
        }
    }

    const clickDownvote = e => {
        if (vote == -1) {
            setVote(0)
            setUpvotes(upvotes + 1)
            setBookNotVote(5)
        } else if (vote == 1) {
            setVote(-1)
            setUpvotes(upvotes - 2)
            setBookNotVote(6)
        } else {
            setVote(-1)
            setUpvotes(upvotes - 1)
            setBookNotVote(7)
        }
    }

    const didMount2 = useRef(false)

    const [low, setLow] = useState(props.questionCommentsPage[0])
    const [high, setHigh] = useState(props.questionCommentsPage[1])

    useEffect(() => {
        if (didMount2.current) {
            const formData = {
                qid: qid,
                low: low,
                high: high,
                search: search,
                comment: commentText,
            }
            getCommentsOfQuestion(formData)
        } else didMount2.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [low])

    const clickLoadMore = e => {
        setLow(high)
        setHigh(high + 5)
    }

    const clickAddComment = e => {
        if (commentFormDisplay == 'none') setCommentFormDisplay('block')
        else setCommentFormDisplay('none')
    }

    const submitComment = e => {
        e.preventDefault()
        const formData = {
            uid: user.uid,
            qid: qid,
            search: search,
            comment: commentText,
        }
        console.log(formData)
        if (commentText !== '') addCommentToQuestion(formData)
    }

    return (
        <div className={classes.questionContainer}>
            <h1 className={classes.header}>
                <FontAwesomeIcon
                    style={bookmark == 1 ? bookmarkStyle : null}
                    icon={faBookmark}
                    className={classes.icon}
                    size="xs"
                    onClick={clickBookmark}
                />{' '}
                {title}
            </h1>
            <p>
                Comments: <b>{comments}</b> Upvotes: <b>{upvotes}</b>
            </p>
            <Link href={`/user/${username}`} passHref={true}>
                <p>
                    Asked by: <b className="link">{username}</b>
                </p>
            </Link>
            <div className={classes.bottom}>
                <p className="time">Asked on: {formattedDate}</p>

                <div className={classes.tagsContainer}>
                    {tagsArray.length > 0 &&
                        tagsArray.map((tag, index) => {
                            return (
                                <div key={index} className="tag">
                                    {tag}
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className={classes.question}>
                <div className={classes.left}>
                    <FontAwesomeIcon
                        style={vote == 1 ? upvoteStyle : null}
                        icon={faArrowUp}
                        className={classes.icon}
                        size="2x"
                        onClick={clickUpvote}
                    />
                    <p>{upvotes}</p>
                    <FontAwesomeIcon
                        style={vote == -1 ? downvoteStyle : null}
                        icon={faArrowDown}
                        className={classes.icon}
                        size="2x"
                        onClick={clickDownvote}
                    />
                </div>
                <div className={classes.right}>
                    <Markdown body={body} />
                </div>
            </div>
            <div className={classes.commentsHeader}>
                <h3>
                    <FontAwesomeIcon
                        icon={faReply}
                        className={classes.inactiveIcon}
                    />{' '}
                    Comments
                </h3>
                <button className="btn btn-primary" onClick={clickAddComment}>
                    +Add comment
                </button>
            </div>
            <div className="comments-container">
                {questionComments.length > 0 &&
                    questionComments.map(comment => {
                        return <Comment key={comment.id} comment={comment} />
                    })}
            </div>
            {questionComments.length > 0 && (
                <button
                    className="btn-small btn-primary"
                    onClick={clickLoadMore}
                    style={{margin: '10px 0'}}
                >
                    Load More
                </button>
            )}

            <div
                className={classes.comment_form}
                style={{display: commentFormDisplay}}
            >
                <form onSubmit={submitComment}>
                    <input
                        type="text"
                        placeholder="Your comment..."
                        value={commentText}
                        onChange={e => setcommentText(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Question
