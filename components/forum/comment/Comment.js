import classes from './Comment.module.css'
import Link from 'next/link'

const Comment = props => {
    const {id, qid, aid, comment, username, uid, added_at} = props.comment
    const formattedDate = new Date(added_at).toLocaleDateString('en-GB')

    return (
        <div className={classes.itemContainer}>
            <div className={classes.left}>
                <p>{comment}</p>
                <p className="time">Added on: {formattedDate}</p>
            </div>
            <Link href={`/user/${username}`} passHref={true}>
                <div className={classes.right}>
                    <div>— {username}</div>
                </div>
            </Link>
        </div>
    )
}

export default Comment
