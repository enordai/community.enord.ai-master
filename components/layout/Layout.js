import {Fragment, useContext, useEffect} from 'react'
import Nav from './Nav'
import MobileNav from './MobileNav'
import AuthContext from '../../context/auth/authContext'

const Layout = props => {
    const authContext = useContext(AuthContext)

    const {loadUser, isAuthenticated} = authContext

    useEffect(() => {
        loadUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    return (
        <Fragment>
            <Nav />
            <main className="LayoutMain">{props.children}</main>
            <MobileNav />
        </Fragment>
    )
}

export default Layout
