import {useContext, useState, useRef, useEffect} from 'react'
import classes from './Answer.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faReply,
    faArrowUp,
    faArrowDown,
    faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import ForumContext from '../../../context/forum/forumContext'
import AuthContext from '../../../context/auth/authContext'
import Comment from '../comment/Comment'
import Markdown from '../../layout/Markdown'

const Answer = props => {
    const forumContext = useContext(ForumContext)
    const {addCommentToAnswer, voteAnswer, getCommentsOfAnswer} = forumContext

    const authContext = useContext(AuthContext)
    const {user} = authContext

    const {qid, aid, body, username, uid, added_at} = props.answer
    const formattedDate = new Date(added_at).toLocaleDateString('en-GB')
    const {search} = props.question

    const comments = props.comments.filter(comment => comment.aid == aid)

    const [commentFormDisplay, setCommentFormDisplay] = useState('none')
    const [commentText, setcommentText] = useState('')

    const temp = props.answersVoted.filter(item => item.aid == aid)[0]
    const initialVote = temp ? temp.vote : 0
    const [vote, setVote] = useState(initialVote)
    const [upvotes, setUpvotes] = useState(props.answer.upvotes)
    const [bookNotVote, setBookNotVote] = useState('')

    const upvoteStyle = {
        color: '#13b775',
    }

    const downvoteStyle = {
        color: '#ff3553',
    }

    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) {
            const voteData = {
                uid: user.uid,
                qid: qid,
                aid: aid,
                search: search,
                vote: vote,
            }
            console.log(voteData)
            voteAnswer(voteData)
        } else didMount.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookNotVote])

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

    const clickAddComment = e => {
        if (commentFormDisplay == 'none') setCommentFormDisplay('block')
        else setCommentFormDisplay('none')
    }

    // const didMount2 = useRef(false)

    // const [low, setLow] = useState(props.questionCommentsPage[0])
    // const [high, setHigh] = useState(props.questionCommentsPage[1])

    // useEffect(() => {
    //     if (didMount2.current) {
    //         const formData = {
    //             qid: qid,
    //             low: low,
    //             high: high,
    //             search: search,
    //             comment: commentText,
    //         }
    //         getCommentsOfQuestion(formData)
    //     } else didMount2.current = true
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [low])

    const clickLoadMore = e => {
        // setLow(high)
        // setHigh(high + 5)
    }

    const submitComment = e => {
        e.preventDefault()
        const formData = {
            uid: user.uid,
            qid: qid,
            aid: aid,
            search: search,
            comment: commentText,
        }
        console.log(formData)
        if (commentText !== '') addCommentToAnswer(formData)
    }

    return (
        <div className={classes.itemContainer}>
            <div className={classes.content}>
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
                    <div className={classes.user}>
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className={classes.img}
                            size="2x"
                        />
                        <div>{username}</div>
                    </div>
                    <p className="time">Answered on: {formattedDate}</p>
                    <Markdown body={body} />
                    <h3>
                        <FontAwesomeIcon
                            icon={faReply}
                            className={classes.inactiveIcon}
                        />{' '}
                        Comments
                    </h3>
                    <button
                        className="btn-small btn-primary"
                        onClick={clickAddComment}
                    >
                        +Add comment
                    </button>
                    <div className="comments-container">
                        {comments.length > 0 &&
                            comments.map(comment => {
                                return (
                                    <Comment
                                        key={comment.id}
                                        comment={comment}
                                    />
                                )
                            })}
                    </div>
                    {comments.length > 0 && (
                        <button
                            className="btn-small btn-primary"
                            onClick={clickLoadMore}
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
            </div>
        </div>
    )
}

export default Answer
