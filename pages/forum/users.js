import UserList from '../../components/user/UserList'
import PrivateRoute from '../../components/auth/PrivateRoute'

export default function forum() {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={false}>
                    <UserList />
                </PrivateRoute>
            </main>
        </div>
    )
}
