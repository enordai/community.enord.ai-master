import Login from '../../components/auth/Login'
import classes from './authBg.module.css'

export default function signup() {
    return (
        <div className={classes.container}>
            <main>
                <Login />
            </main>
        </div>
    )
}
