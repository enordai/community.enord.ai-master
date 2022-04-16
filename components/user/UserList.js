import React, {useContext} from 'react'
import classes from './UserList.module.css'
import LeftPanel from '../forum/leftPanel/LeftPanel'
import RightPanel from '../forum/rightPanel/RightPanel'
import UserItem from './UserItem'
import UserContext from '../../context/user/userContext'

function UserList(props) {
    const userContext = useContext(UserContext)
    const {users} = userContext

    return (
        <div className={classes.center}>
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
    )
}

export default UserList
