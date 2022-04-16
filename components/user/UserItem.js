import classes from './UserItem.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserCircle} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/dist/client/router'

const UserItem = props => {
    const {last_login_on, answers_count, questions_count, username, fullname} =
        props.user

    const formattedDate = new Date(last_login_on).toLocaleDateString('en-GB')

    const router = useRouter()

    const redirectToUserPage = () => {
        router.push(`/user/${username}`)
    }

    return (
        <div className={classes.itemContainer} onClick={redirectToUserPage}>
            <div className={classes.left} onClick={redirectToUserPage}>
                <FontAwesomeIcon
                    icon={faUserCircle}
                    className={classes.img}
                    size="2x"
                />
                <div>{username}</div>
                <p className={classes.lightp}>{fullname}</p>
            </div>
            <div className={classes.right}>
                <p>{questions_count} Questions</p>
                <p>{answers_count} Answers</p>
                <p className={classes.lightp}> Last Online: {formattedDate}</p>
            </div>
        </div>
    )
}

export default UserItem
