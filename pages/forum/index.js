import Forum from '../../components/forum/Forum'
import PrivateRoute from '../../components/auth/PrivateRoute'

export default function forum() {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={false}>
                    <Forum />
                </PrivateRoute>
            </main>
        </div>
    )
}
