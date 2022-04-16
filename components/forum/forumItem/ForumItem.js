import classes from './ForumItem.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserCircle} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'
import removeMd from 'remove-markdown'
import Link from 'next/link'

const ForumItem = props => {
    const {
        qid,
        search,
        title,
        body,
        upvotes,
        comments,
        total_answers,
        uid,
        username,
        added_at,
        tags,
    } = props.question

    const tagsArray = tags.split(' ')

    const formattedDate = new Date(added_at).toLocaleDateString('en-GB')

    const router = useRouter()

    var description = removeMd(body.slice(0, 240))
    description += body.length > 241 ? '...' : ''

    return (
        <div className={classes.itemContainer}>
            <div className={classes.left}>
                <p>
                    {upvotes} <br />
                    <b> Upvotes</b>
                </p>
                <p>
                    {total_answers} <br />
                    <b>Answers</b>
                </p>
                <p>
                    {comments} <br />
                    <b>Comments</b>
                </p>
            </div>
            <div className={classes.center}>
                <Link href={`/forum/${search}`} passHref={true}>
                    <div className={classes.question}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </Link>
                <div className={classes.bottom}>
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
            </div>
            {Object.keys(router.query).length === 0 && (
                <Link href={`/user/${username}`} passHref={true}>
                    <div className={classes.user}>
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className={classes.img}
                            size="2x"
                        />
                        <div>{username}</div>
                        <p className={classes.time}>{formattedDate}</p>
                    </div>
                </Link>
            )}
        </div>
    )
}

export default ForumItem
