import {useContext, useState} from 'react'
import classes from './RightPanel.module.css'
import UserContext from '../../../context/user/userContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import UserItem from '../../user/UserItem'

function RightPanel() {
    const userContext = useContext(UserContext)
    const {users, searchUser} = userContext

    const [userquery, setUserquery] = useState('')

    const userQueryChange = e => {
        setUserquery(e.target.value)
    }

    const submitSearchUsers = e => {
        e.preventDefault()
        console.log(userquery)
        if (userquery != '') {
            searchUser(userquery)
        }
    }

    return (
        <div className={classes.right}>
            <form onSubmit={submitSearchUsers} className={classes.search}>
                <input
                    name="userquery"
                    placeholder="Search Users..."
                    value={userquery}
                    onChange={userQueryChange}
                ></input>
                <button type="submit">
                    <FontAwesomeIcon
                        icon={faUser}
                        className={classes.search_icon}
                    />
                </button>
            </form>
            <div className={classes.usersContainer}>
                <h1>Users</h1>
                <div className={classes.users}>
                    {users.length > 0 ? (
                        users.map((user, index) => {
                            return <UserItem key={index} user={user} />
                        })
                    ) : (
                        <p>No Users Found</p>
                    )}
                </div>
            </div>
            <div className={classes.statBox}>
                <h3>Stats</h3>
                <ul>
                    <li>100 Questions</li>
                    <li>50 Answers</li>
                    <li>70 Posts</li>
                    <li>20 Comments</li>
                </ul>
            </div>
        </div>
    )
}

export default RightPanel
