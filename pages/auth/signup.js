import Signup from '../../components/auth/Signup'
import classes from './authBg.module.css'

export default function signup() {
    return (
        <div className={classes.container}>
            <main>
                <Signup />
            </main>
        </div>
    )
}
