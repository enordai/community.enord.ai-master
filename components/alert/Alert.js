import React, {Fragment, useContext} from 'react'
import classes from './Alert.module.css'
import AuthContext from '../../context/auth/authContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faExclamationCircle,
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'

const Alert = () => {
    const authContext = useContext(AuthContext)

    const {alert, clearAlert} = authContext

    const handleClick = () => {
        clearAlert()
    }

    const {type, msg} = alert
    const iconType = type == 'Success' ? faCheckCircle : faExclamationCircle

    const AlertContent = () => {
        return (
            <Fragment>
                <div className={classes.left}>
                    <FontAwesomeIcon icon={iconType} />
                    <p>
                        {type}: {msg}
                    </p>
                </div>
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    className={classes.closeAlert}
                    onClick={handleClick}
                />
            </Fragment>
        )
    }

    if (type == 'Success')
        return (
            <div className={classes.success}>
                <AlertContent />
            </div>
        )
    else
        return (
            <div className={classes.error}>
                <AlertContent />
            </div>
        )
}

export default Alert
