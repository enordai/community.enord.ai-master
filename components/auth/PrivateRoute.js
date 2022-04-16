import {useContext, useEffect} from 'react'
import AuthContext from '../../context/auth/authContext'
import {useRouter} from 'next/dist/client/router'

const PrivateRoute = props => {
    const authContext = useContext(AuthContext)
    const {isAuthenticated, isVerifiedEmail, setAlert} = authContext

    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) router.replace('/auth')
        if (props.emailRequired && !isVerifiedEmail) {
            setAlert('Error', 'Verify your Email access that page!', 5000)
            router.replace('/forum')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    if (isAuthenticated) {
        if (props.emailRequired && !isVerifiedEmail) {
            return null
        }
        return props.children
    }
    return null
}

export default PrivateRoute
