import AuthUserProfile from '../../components/user/AuthUserProfile'
import PrivateRoute from '../../components/auth/PrivateRoute'

export default function AuthProfile() {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={false}>
                    <AuthUserProfile />
                </PrivateRoute>
            </main>
        </div>
    )
}
