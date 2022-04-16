import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import AuthState from '../context/auth/AuthState'
import UserState from '../context/user/UserState'
import ForumState from '../context/forum/ForumState'

function MyApp({Component, pageProps}) {
    return (
        <AuthState>
            <UserState>
                <ForumState>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ForumState>
            </UserState>
        </AuthState>
    )
}

export default MyApp
