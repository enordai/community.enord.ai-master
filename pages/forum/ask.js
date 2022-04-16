import AskQuestion from '../../components/forum/question/askQuestion'
import PrivateRoute from '../../components/auth/PrivateRoute'

export default function Ask() {
    return (
        <div>
            <main>
                <PrivateRoute emailRequired={true}>
                    <AskQuestion />
                </PrivateRoute>
            </main>
        </div>
    )
}
