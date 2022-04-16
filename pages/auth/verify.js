import OTPForm from '../../components/auth/OTPForm'
import classes from './authBg.module.css'

export default function OTP() {
    return (
        <div className={classes.container}>
            <main>
                <OTPForm />
            </main>
        </div>
    )
}
